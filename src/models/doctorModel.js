const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userID: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      enum: ["Minimal", "Moderate", "Severe", "Pending"],
      default: "Pending",
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Comment", commentSchema);
