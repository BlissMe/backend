const {
    computeAndSaveDepressionIndexByUser,
    getLatestSavedIndexByUser,
    getIndexHistoryByUser,
} = require("../services/detectionService");

const handleGetDepressionIndex = async (req, res) => {
    try {
        const userID = req.user.userID;
        const { computed, savedId } = await computeAndSaveDepressionIndexByUser(userID);
        return res.status(200).json({ success: true, data: computed, savedId });
    } catch (err) {
        console.error("depression-index failed:", err);
        return res.status(500).json({ success: false, error: "Failed to compute depression index" });
    }
};

const handleGetLatestIndex = async (req, res) => {
    try {
        const userID = req.user.userID;
        const doc = await getLatestSavedIndexByUser(userID);
        return res.status(200).json({ success: true, data: doc });
    } catch (err) {
        console.error("latest-index failed:", err);
        return res.status(500).json({ success: false, error: "Failed to fetch latest index" });
    }
};

const handleGetIndexHistory = async (req, res) => {
    try {
        const userID = req.user.userID;
        const limit = req.query.limit || 10;
        const rows = await getIndexHistoryByUser(userID, limit);
        return res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error("index-history failed:", err);
        return res.status(500).json({ success: false, error: "Failed to fetch history" });
    }
};

module.exports = {
    handleGetDepressionIndex,
    handleGetLatestIndex,
    handleGetIndexHistory,
};
