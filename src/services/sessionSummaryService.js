
const Chat = require("../models/chatModel");
const SessionSummary = require("../models/sessionSummaryModel");
const { decrypt, encrypt } = require("../utils/chatEncryption");
const axios = require("axios");

async function generateAndSaveSessionSummary(userID, sessionID) {
    const chats = await Chat.find({ userID, sessionID }).sort({ timestamp: 1 });

    const fullChat = chats.map(chat => {
        const decryptedMessage = decrypt(chat.message);
        return `${chat.sender}: ${decryptedMessage}`;
    }).join("\n");

    const response = await axios.post("http://localhost:8000/summarize", {
        history: fullChat,
    });

    const summaryText = response.data.summary;
    const encryptedSummary = encrypt(summaryText);

    const sessionSummary = new SessionSummary({
        userID,
        sessionID,
        summary: encryptedSummary,
    });

    await sessionSummary.save();
    return summaryText;
}

async function getSessionSummary(userID, sessionID) {
    const summary = await SessionSummary.findOne({ userID, sessionID });
    return summary ? decrypt(summary.summary) : null;
}

module.exports = { generateAndSaveSessionSummary, getSessionSummary };
