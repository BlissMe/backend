const mongoose = require("mongoose");

const moodRecordSchema = new mongoose.Schema(
  {
    userId: { 
      type: Number,   
      ref: "User",
      required: true,
    },
    mood: {
      type: String,
      required: true,
    },
    sleepHours: {
      type: String,
      default: "",
    },
    reflection: {
      type: String,
      default: "",
    },
    tags: {
      type: [String], // <-- new field
      default: [],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MoodRecord", moodRecordSchema);
