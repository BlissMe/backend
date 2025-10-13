const express = require("express");
const { logMood, getTodayMood, getAllMoodRecords } = require("../controllers/moodController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/log", auth, logMood);
router.get("/today", auth, getTodayMood);
router.get("/all", auth, getAllMoodRecords);

module.exports = router;
