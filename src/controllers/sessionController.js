const { createSession } = require("../services/sessionService");
const { generateAndSaveSessionSummary } = require("../services/sessionSummaryService");
const ChatSession = require("../models/chatSessionModel");


const handleCreateSession = async (req, res) => {
    const userID = req.user.userID;
    try {
        const sessionID = await createSession(userID);
        res.status(200).json({ sessionID });
    } catch (err) {
        res.status(500).json({ error: "Failed to create session", details: err.message });
    }
};


const handleEndSession = async (req, res) => {
    const userID = req.user.userID;
    const { sessionID } = req.body;

    try {
        await ChatSession.findOneAndUpdate(
            { userID, sessionID },
            { endedAt: new Date() }
        );

        const summary = await generateAndSaveSessionSummary(userID, sessionID);

        res.status(200).json({ success: true, summary });
    } catch (err) {
        console.error("Error ending session:", err.message);
        res.status(500).json({ success: false, error: "Failed to end session" });
    }
};

module.exports = {
    handleCreateSession,
    handleEndSession
};
