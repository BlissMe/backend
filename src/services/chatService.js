const Chat = require("../models/chatModel");
const { encrypt, decrypt } = require("../utils/chatEncryption");

async function saveMessage({ userID, sessionID, sender, message }) {
    try {

        const encrypted = encrypt(message);

        const chat = new Chat({ userID, sessionID, sender, message: encrypted });
        await chat.save();

    } catch (err) {
        console.error(" Error in saveMessage():", err);
        throw err;
    }
}

async function getSessionMessages(userID, sessionID, limit = 10) {
    const chats = await Chat.find({ userID, sessionID }).sort({ timestamp: -1 }).limit(limit);
    return chats.reverse().map((chat) => ({
        sender: chat.sender,
        message: decrypt(chat.message),
        timestamp: chat.timestamp,
    }));
}

module.exports = { saveMessage, getSessionMessages };
