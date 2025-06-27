const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadCharacter } = require("../controllers/characterController");

// Multer configuration
const storage = multer.diskStorage({
    destination: "uploads/", // Temporary storage before uploading to Cloudinary
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

router.post("/upload", upload.single("image"), uploadCharacter);

module.exports = router;
