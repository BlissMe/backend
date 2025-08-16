const express = require("express");
const {
    handleSaveClassifierResult,
    handleGetMyClassifierResults,
} = require("../controllers/classifierResultController");
const { authenticateToken } = require("../services/authentication");

const router = express.Router();

router.post("/classifier/save", authenticateToken, handleSaveClassifierResult);
router.get("/classifier/user", authenticateToken, handleGetMyClassifierResults);

module.exports = router;
