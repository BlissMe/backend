const express = require("express");
const { handleCreateSession, handleEndSession } = require("../controllers/sessionController");
const { authenticateToken } = require("../services/authentication");

const router = express.Router();

// Route to create new session per user
router.post("/start", authenticateToken, handleCreateSession);
router.post("/end", authenticateToken, handleEndSession);

module.exports = router;
