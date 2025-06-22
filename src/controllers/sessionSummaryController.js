const { generateAndSaveSessionSummary, getSessionSummariesByUserID } = require("../services/sessionSummaryService");

const handleGenerateSessionSummary = async (req, res) => {
    const userID = req.user.userID;
    const { sessionID } = req.body;

    try {
        const summary = await generateAndSaveSessionSummary(userID, sessionID);
        res.status(200).json({ success: true, summary });
    } catch (err) {
        console.error("Failed to generate session summary:", err);
        res.status(500).json({ success: false, error: "Summary generation failed" });
    }
};

const handleGetSessionSummaries = async (req, res) => {
    const userID = req.user.userID;

    try {
        const summaries = await getSessionSummariesByUserID(userID);
        res.status(200).json({ summaries });
    } catch (err) {
        console.error("Failed to fetch session summaries:", err);
        res.status(500).json({ success: false, error: "Failed to fetch summaries" });
    }
};

module.exports = { handleGenerateSessionSummary, handleGetSessionSummaries };
