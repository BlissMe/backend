const { savePHQ9Answer} = require("../services/phq9Service");
const PHQ9Response = require("../models/phq9Model");

const handleSavePHQ9Answer = async (req, res) => {
  const { userID } = req.user;
  const { sessionID, questionID, question, answer } = req.body;
  try {
    const saved = await savePHQ9Answer({
      userID,
      sessionID,
      questionID,
      question,
      answer,
    });
    res.json({ success: true, saved });
  } catch (err) {
    console.error("Error saving PHQ9:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const handleGetLastSession = async (req, res) => {
  const { userID } = req.params;

  try {
    const lastEntry = await PHQ9Response.findOne({ userID })
      .sort({ createdAt: -1 }) // most recent session
      .lean();

    if (!lastEntry)
      return res.json({ success: true, sessionID: null, answeredCount: 0 });

    const { sessionID } = lastEntry;
    const answeredCount = await PHQ9Response.countDocuments({
      userID,
      sessionID,
    });

    res.json({ success: true, sessionID, answeredCount });
  } catch (err) {
    console.error("Error getting last session:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleSavePHQ9Answer, handleGetLastSession };
