const express = require("express");
const { handleGenerateSessionSummary, handleGetSessionSummaries } = require("../controllers/sessionSummaryController");
const { authenticateToken } = require("../services/authentication");

const router = express.Router();

router.post("/generate-summary", authenticateToken, handleGenerateSessionSummary);
router.get("/session-summaries", authenticateToken, handleGetSessionSummaries);

module.exports = router;