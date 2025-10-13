const mongoose = require("mongoose");
const BreathingSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  protocolId: String,
  durationMinutes: Number,
  cyclesCompleted: Number,
  rpe: { type: Number, min: 0, max: 10 },   
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("BreathingSession", BreathingSessionSchema);
