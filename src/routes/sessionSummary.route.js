const express = require("express");
const { handleGenerateSessionSummary } = require("../controllers/sessionSummaryController");
const { authenticateToken } = require("../services/authentication");

const router = express.Router();

router.post("/generate-summary", authenticateToken, handleGenerateSessionSummary);

module.exports = router;