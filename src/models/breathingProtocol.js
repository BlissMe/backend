
const mongoose = require("mongoose");
const BreathingProtocolSchema = new mongoose.Schema({
  protocolId: { type: String, unique: true },
  label: String,
  cycleMs: Number,
  bpm: Number,
  phases: [
    {
      name: { type: String, enum: ["inhale","exhale","hold"], required: true },
      durationMs: { type: Number, required: true },
    },
  ],
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model("BreathingProtocol", BreathingProtocolSchema);
