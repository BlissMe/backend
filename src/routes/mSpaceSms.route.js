const express = require("express");
const { sendTherapySMS } = require("../controllers/mSpaceSmsController");

const router = express.Router();

// POST /sms/send
router.post("/send", sendTherapySMS);

module.exports = router;
