const express = require("express");
const { sendSubscription, sendSubscriberNotification ,requestOtp,verifyOtp} = require("../controllers/SubscrptionsContoller");
const router = express.Router();

router.post("/subscribe", sendSubscription);
router.post("/notify", sendSubscriberNotification);
router.post("/otp-send", requestOtp);
router.post("/otp-verify", verifyOtp);


module.exports = router;
