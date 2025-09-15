const MoodRecord = require("../models/moodModel");

// Log today's mood
const logMood = async (req, res) => {
  try {
    const { mood, sleepHours, reflection } = req.body;
    const userId = req.user.userId;

    // Calculate today's range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existing = await MoodRecord.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

   /*  if (existing) {
      return res.status(400).json({ message: "You already logged today's mood" });
    } */

    // Store sleepHours directly as string
    const record = await MoodRecord.create({
      userId,
      mood,
      sleepHours,
      reflection,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get today's mood
const getTodayMood = async (req, res) => {
  try {
    const userId = req.user.userId;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const record = await MoodRecord.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (!record) {
      return res.status(404).json({ message: "No record today" });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all mood records
const getAllMoodRecords = async (req, res) => {
  try {
    const userId = req.user.userId;

    const records = await MoodRecord.find({ userId }).sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { logMood, getTodayMood, getAllMoodRecords };
