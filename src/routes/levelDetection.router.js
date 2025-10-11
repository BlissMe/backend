const express = require("express");
const { authenticateToken } = require("../services/authentication");
const {
    handleGetDepressionIndex,
    handleGetLatestIndex,
    handleGetIndexHistory,
    handleGetAllUsersLatestIndex,
} = require("../controllers/levelDetectionController");

const router = express.Router();

router.get("/depression-index", authenticateToken, handleGetDepressionIndex); // computes & saves
router.get("/depression-index/latest", authenticateToken, handleGetLatestIndex);
router.get("/depression-index/history", authenticateToken, handleGetIndexHistory);
router.get("/all-users-latest-index", authenticateToken, handleGetAllUsersLatestIndex);


module.exports = router;
