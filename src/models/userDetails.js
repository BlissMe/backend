const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  virtualName: { type: String, required: true },
  character: { type: String, required: true },
  inputMethod: { type: String, required: true },
  role: { type: String, enum: ["patient", "doctor"], default: "patient" },
});

module.exports = mongoose.model("UserDetails", userDetailsSchema);
