const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadCharacter, getAllCharacters } = require("../controllers/characterController");

let uploadDir;

try {
  uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.error("⚠️ Failed to create upload directory, using /tmp instead:", err);
  uploadDir = "/tmp/uploads";
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), uploadCharacter);
router.get("/all-characters", getAllCharacters);

module.exports = router;
