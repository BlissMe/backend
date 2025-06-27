const mongoose = require("mongoose");

const phq9Schema = new mongoose.Schema({
    userID: { type: Number, required: true },
    sessionID: { type: Number, required: true },
    questionID: { type: Number, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    score: { type: Number, required: true },
    askedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PHQ9", phq9Schema);
