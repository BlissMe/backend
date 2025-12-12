const express = require("express");
const { sendSubscription } = require("../controllers/SubscrptionsContoller");
const router = express.Router();

router.post("/subscribe", sendSubscription);

module.exports = router;
