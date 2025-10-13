const express = require("express");
const { authenticateToken } = require("../services/authentication");
const { handleSavePHQ9Answer,handleGetLastSession } = require("../controllers/phq9Controller");

const router = express.Router();
router.post("/phq9-save", authenticateToken, handleSavePHQ9Answer);
router.get("/last-session/:userID", authenticateToken, handleGetLastSession);

module.exports = router;
