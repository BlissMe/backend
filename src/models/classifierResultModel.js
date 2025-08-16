const mongoose = require("mongoose");

const classifierResultSchema = new mongoose.Schema({
    userID: { type: Number, required: true },
    sessionID: { type: Number, required: true },

    depression_label: {
        type: String,
        enum: ["Depression Signs Detected", "No Depression Signs Detected"],
        required: true,
    },
    depression_confidence_detected: {
        type: Number, // normalized 0..1
        min: 0,
        max: 1,
        required: true,
    },

    emotion: {
        type: String,
        enum: ["happy", "neutral", "sad", "angry", "fearful"],
        required: true,
    },
    emotion_confidence: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },

    // store rationale encrypted (optional but recommended)
    rationale_encrypted: { type: String, required: true },

    // optional raw payload for traceability/debugging
    raw_payload: { type: mongoose.Schema.Types.Mixed },

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ClassifierResult", classifierResultSchema, "classifierResults");
