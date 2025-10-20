const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadSketch, getAllSketches } = require("../controllers/sketchController");

// Multer configuration
const storage = multer.diskStorage({
    destination: "uploads/", // Temporary storage before uploading to Cloudinary
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

router.post("/sketch/upload", upload.single("image"), uploadSketch);
router.get("/sketches", getAllSketches);

module.exports = router;
