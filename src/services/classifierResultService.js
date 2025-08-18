const ClassifierResult = require("../models/classifierResultModel");
const { encrypt, decrypt } = require("../utils/chatEncryption");

/**
 * Save classifier result for a user/session.
 * @param {number} userID
 * @param {number} sessionID
 * @param {{
 *  depression_label: string,
 *  depression_confidence_detected: number, // 0..1
 *  emotion: "happy"|"neutral"|"sad"|"angry"|"fearful",
 *  emotion_confidence: number, // 0..1
 *  rationale: string
 * }} result
 */

const DEP_LABELS = new Set([
    "Depression Signs Detected",
    "No Depression Signs Detected",
]);
const EMO_LABELS = new Set(["happy", "neutral", "sad", "angry", "fearful"]);

function normalize01(v, def = 0) {
    const n = Number(v);
    if (!Number.isFinite(n)) return def;
    if (n < 0) return 0;
    if (n <= 1) return n;
    if (n <= 100) return n / 100;
    return 1;
}

function round4(x) {
    return Math.round(x * 1e4) / 1e4;
}

async function saveClassifierResult(userID, sessionID, result) {
    const {
        depression_label,
        depression_confidence_detected,
        emotion,
        emotion_confidence,
        rationale,
    } = result || {};

    // Validate labels
    if (!DEP_LABELS.has(depression_label)) {
        throw new Error("Invalid depression_label");
    }
    if (!EMO_LABELS.has(emotion)) {
        throw new Error("Invalid emotion label");
    }

    // Normalize *before* asserting numeric shape
    const depConf = round4(normalize01(depression_confidence_detected, 0.5));
    const emoConf = round4(normalize01(emotion_confidence, 0.5));

    if (!Number.isFinite(depConf) || !Number.isFinite(emoConf)) {
        throw new Error("Invalid confidence values");
    }

    const doc = new ClassifierResult({
        userID,
        sessionID,
        depression_label,
        depression_confidence_detected: depConf, // 0..1
        emotion,
        emotion_confidence: emoConf,             // 0..1
        rationale_encrypted: encrypt(rationale || ""),
        raw_payload: result,                      // keep original for traceability
    });

    await doc.save();
    return doc;
}

async function getClassifierResultsByUser(userID) {
    const rows = await ClassifierResult.find({ userID }).sort({ createdAt: -1 });
    return rows.map(r => ({
        id: r._id,
        userID: r.userID,
        sessionID: r.sessionID,
        depression_label: r.depression_label,
        depression_confidence_detected: r.depression_confidence_detected,
        emotion: r.emotion,
        emotion_confidence: r.emotion_confidence,
        rationale: decrypt(r.rationale_encrypted),
        createdAt: r.createdAt,
    }));
}



module.exports = {
    saveClassifierResult,
    getClassifierResultsByUser,

};
