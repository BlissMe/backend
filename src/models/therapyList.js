const mongoose = require("mongoose");

const therapySchema = new mongoose.Schema(
    {
        therapyID: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        applicableLevel: {
            type: String,
            enum: ["Minimal", "Moderate", "Severe"],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        path: {
            type: String, // e.g., a reference path for therapy module or audio/video
            required: false,
        },
        durationMinutes: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "Therapies" }
);

module.exports = mongoose.model("Therapy", therapySchema);