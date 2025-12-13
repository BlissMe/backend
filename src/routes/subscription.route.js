const express = require("express");
const { sendSubscription, sendSubscriberNotification } = require("../controllers/SubscrptionsContoller");
const router = express.Router();

router.post("/subscribe", sendSubscription);
router.post("/notify", sendSubscriberNotification);

module.exports = router;
