const express = require("express");
const { authenticateToken } = require("../services/authentication");
const {
    handleGetDepressionIndex,
    handleGetLatestIndex,
    handleGetIndexHistory,
} = require("../controllers/levelDetectionController");

const router = express.Router();

router.get("/depression-index", authenticateToken, handleGetDepressionIndex); // computes & saves
router.get("/depression-index/latest", authenticateToken, handleGetLatestIndex);
router.get("/depression-index/history", authenticateToken, handleGetIndexHistory);

module.exports = router;
