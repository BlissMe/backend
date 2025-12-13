const express = require("express");
const { sendSubscription, sendSubscriberNotification, requestOtp, verifyOtp } = require("../controllers/subscrptionsContoller");
const router = express.Router();
const { authenticateToken } = require("../services/authentication");

router.post("/subscribe", sendSubscription);
router.post("/notify", sendSubscriberNotification);
router.post("/otp-send", requestOtp);
router.post("/otp-verify", verifyOtp);
//router.post("/save-subscriber", authenticateToken, saveSubscriberController);

module.exports = router;
