const MSpace = require("../models/mSpaceModel");

async function saveSubscriber({ userID, subscriberId, subscriptionStatus }) {
    // Avoid duplicates
    const existing = await MSpace.findOne({ subscriberId });
    if (existing) return existing;

    const record = new MSpace({
        userID,
        subscriberId,
        subscriptionStatus
    });

    await record.save();
    return record;
}

module.exports = { saveSubscriber };
