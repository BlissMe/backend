
const ChatSession = require("../models/chatSessionModel");

let sessionCounter = {}; // Track in-memory counters per userID

async function createSession(userID) {
    if (!sessionCounter[userID]) {
        const latestSession = await ChatSession.findOne({ userID }).sort({ sessionID: -1 });
        sessionCounter[userID] = latestSession ? latestSession.sessionID + 1 : 1;
    } else {
        sessionCounter[userID]++;
    }

    const session = new ChatSession({ userID, sessionID: sessionCounter[userID] });
    await session.save();
    return session.sessionID;
}

module.exports = { createSession };
