
const { saveMessage, getSessionMessages } = require("../services/chatService");

const handleSaveMessage = async (req, res) => {
    try {
        const { message, sessionID } = req.body;
        const userID = req.user.userID;
        const sender = req.body.sender || "user";

        await saveMessage({ userID, sessionID, sender, message });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to save chat message" });
    }
};

const handleGetChatHistory = async (req, res) => {
    try {
        const { sessionID } = req.params;
        const userID = req.user.userID;

        const history = await getSessionMessages(userID, sessionID, 20);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};


module.exports = {
    handleSaveMessage,
    handleGetChatHistory,
};
