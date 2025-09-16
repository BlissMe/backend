const express = require("express");
const multer = require("multer");
const songController = require("../controllers/songController");

const router = express.Router();

// configure multer for multipart/form-data
const upload = multer({ dest: "tmp/" });

router.post(
    "/songs",
    upload.fields([
        { name: "audio", maxCount: 1 },
        { name: "cover", maxCount: 1 },
    ]),
    songController.createSong
);

router.get("/songs", songController.listSongs);

module.exports = router;
