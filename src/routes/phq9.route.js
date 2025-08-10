const express = require("express");
const { authenticateToken } = require("../services/authentication");
const { handleSavePHQ9Answer } = require("../controllers/phq9Controller");

const router = express.Router();
router.post("/phq9-save", authenticateToken, handleSavePHQ9Answer);
module.exports = router;
