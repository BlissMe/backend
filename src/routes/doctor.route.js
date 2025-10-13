const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../services/authentication");
const { addComment, getComments } = require("../controllers/doctorContoller");

router.post("/comments", authenticateToken, addComment);
router.get("/comments", authenticateToken, getComments);

module.exports = router;
