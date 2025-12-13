const mongoose = require("mongoose");

const mSpaceSchema = new mongoose.Schema({
    userID: {
        type: Number,
        required: true,
        index: true
    },
    subscriberId: {
        type: String,
        required: true,
        unique: true
    },
    subscriptionStatus: {
        type: String,
        default: "UNKNOWN"
    },
    action: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("MSpace", mSpaceSchema);
