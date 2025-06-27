const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema({
    userID: {
        type: Number,
        required: true
    },
    sessionID: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    endedAt: { type: Date },
});

module.exports = mongoose.model("ChatSession", chatSessionSchema);
