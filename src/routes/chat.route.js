const express = require("express");
const { handleSaveMessage, handleGetChatHistory, } = require("../controllers/chatController");
const { authenticateToken } = require("../services/authentication");

const router = express.Router();


router.post("/save", authenticateToken, handleSaveMessage);
router.get("/history/:sessionID", authenticateToken, handleGetChatHistory);

module.exports = router;
