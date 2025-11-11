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
    let { sessionID } = req.body;

    try {
        sessionID = Number(sessionID);
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

const handleGetLatestSession = async (req, res) => {
    const userID = req.query.userID; 

    if (!userID) {
        return res.status(400).json({ error: "Missing userID parameter" });
    }

    try {
        const latestSession = await ChatSession.findOne({ userID })
            .sort({ createdAt: -1 })
            .lean();

        if (!latestSession) {
            return res.status(404).json({ error: "No session found" });
        }

        res.status(200).json({
            success: true,
            sessionID: latestSession.sessionID,
            createdAt: latestSession.createdAt,
        });
    } catch (err) {
        console.error("Error fetching latest session:", err.message);
        res.status(500).json({ error: "Failed to fetch session" });
    }
};

module.exports = {
    handleCreateSession,
    handleEndSession,
    handleGetLatestSession
};
