const {
    saveClassifierResult,
    getClassifierResultsByUser,
} = require("../services/classifierResultService");


const handleSaveClassifierResult = async (req, res) => {
    try {
        const userID = req.user.userID;
        const { sessionID, classifier } = req.body;

        if (typeof sessionID !== "number" || !classifier) {
            return res.status(400).json({ success: false, error: "sessionID and classifier are required" });
        }

        const saved = await saveClassifierResult(userID, sessionID, classifier);
        return res.status(201).json({ success: true, id: saved._id });
    } catch (err) {
        console.error("Failed to save classifier result:", err);
        return res.status(500).json({ success: false, error: "Failed to save classifier result" });
    }
};


const handleGetMyClassifierResults = async (req, res) => {
    try {
        const userID = req.user.userID;
        const data = await getClassifierResultsByUser(userID);
        return res.status(200).json({ results: data });
    } catch (err) {
        console.error("Failed to fetch classifier results:", err);
        return res.status(500).json({ success: false, error: "Failed to fetch classifier results" });
    }
};


module.exports = {
    handleSaveClassifierResult,
    handleGetMyClassifierResults,
};
