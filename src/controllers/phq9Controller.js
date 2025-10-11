const { savePHQ9Answer, getAskedPHQ9IDs } = require("../services/phq9Service");

const handleSavePHQ9Answer = async (req, res) => {
    const { userID } = req.user;
    const { sessionID, questionID, question, answer } = req.body;
    try {
        const saved = await savePHQ9Answer({ userID, sessionID, questionID, question, answer });
        res.json({ success: true, saved });
    } catch (err) {
        console.error("Error saving PHQ9:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const handleGetAnsweredCountByUser = async (req, res) => {
  const { userID } = req.params;
  try {
    // find latest session for this user
    const latestSession = await Session.findOne({ userID })
      .sort({ createdAt: -1 }) // latest
      .lean();

    if (!latestSession) {
      return res.json({ success: true, answeredCount: 0 });
    }

    const answeredIDs = await getAskedPHQ9IDs(userID, latestSession._id);
    res.json({
      success: true,
      answeredCount: answeredIDs.length,
    });
  } catch (err) {
    console.error("Error fetching answered count:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


module.exports = { handleSavePHQ9Answer,handleGetAnsweredCountByUser };
