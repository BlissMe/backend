const { generateAndSaveSessionSummary } = require("../services/sessionSummaryService");

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

module.exports = { handleGenerateSessionSummary };
