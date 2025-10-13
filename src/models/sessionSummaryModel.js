
const mongoose = require("mongoose");

const sessionSummarySchema = new mongoose.Schema({
    userID: {
        type: Number,
        required: true,
    },
    sessionID: {
        type: Number,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("SessionSummary", sessionSummarySchema);
