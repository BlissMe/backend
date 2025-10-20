const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadCharacter, getAllCharacters } = require("../controllers/characterController");

const uploadDir =
  process.env.UPLOAD_DIR ||
  (process.env.NODE_ENV === "production"
    ? "/tmp/uploads" 
    : path.join(__dirname, "../../uploads")); 


try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  console.log("✅ Upload directory:", uploadDir);
} catch (err) {
  console.error("❌ Failed to create upload directory:", err);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), uploadCharacter);
router.get("/all-characters", getAllCharacters);

module.exports = router;
