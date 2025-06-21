const { createSession } = require("../services/sessionService");

const handleCreateSession = async (req, res) => {
    const userID = req.user.userID;
    try {
        const sessionID = await createSession(userID);
        res.status(200).json({ sessionID });
    } catch (err) {
        res.status(500).json({ error: "Failed to create session", details: err.message });
    }
};

module.exports = {
    handleCreateSession,
};
