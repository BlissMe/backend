const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadSketch, getAllSketches } = require("../controllers/sketchController");

let uploadDir;

try {
  uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.error("Failed to create upload directory in project root. Falling back to /tmp:", err);
  uploadDir = "/tmp/uploads";
  fs.mkdirSync(uploadDir, { recursive: true });
}

console.log("Sketch uploads directory:", uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/sketch/upload", upload.single("image"), uploadSketch);
router.get("/sketches", getAllSketches);

module.exports = router;
