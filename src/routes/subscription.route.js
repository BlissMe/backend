const express = require("express");
const { sendSubscription, sendSubscriberNotification, requestOtp, verifyOtp } = require("../controllers/subscrptionsContoller");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

router.post("/subscribe", sendSubscription);
router.post("/notify", sendSubscriberNotification);
router.post("/otp-send", requestOtp);
router.post("/otp-verify", authenticate, verifyOtp);


module.exports = router;
