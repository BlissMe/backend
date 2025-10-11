const express = require("express");
const { authenticateToken } = require("../services/authentication");
const { handleSavePHQ9Answer,handleGetAnsweredCountByUser } = require("../controllers/phq9Controller");

const router = express.Router();
router.post("/phq9-save", authenticateToken, handleSavePHQ9Answer);
router.get("/phq9/answered/:userID", authenticateToken, handleGetAnsweredCountByUser);

module.exports = router;
