const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const PHQ9 = require("../models/phq9Model");
const ClassifierResult = require("../models/classifierResultModel");
const DepressionIndexResult = require("../models/levelDetectionModel");

// ---- load fusion config (weights, cutoffs, isotonic curve) ----
function loadFusionConfig() {
    const cfgPath = path.resolve(__dirname, "..", "config", "fusion_config.json");
    try {
        const txt = fs.readFileSync(cfgPath, "utf-8");
        const cfg = JSON.parse(txt);
        if (!cfg.weights || !cfg.cutoffs) throw new Error("fusion_config missing required keys");
        return cfg;
    } catch (e) {
        console.warn(`fusion_config.json not found at ${cfgPath}; using baked defaults.`, e.message);
        return {
            weights: { phq9: 0.7895, classifier: 0.1579, emotion: 0.0526 },
            cutoffs: { minimal_max: 0.1890, moderate_max: 0.7266 },
            calibration: { x_thresholds: null, y_thresholds: null },
            version: "default",
        };
    }
}
const FUSION = loadFusionConfig();

// ---- helpers ----
function round4(x) { return Math.round(x * 1e4) / 1e4; }
function emotionToBinary(label) {
    if (!label) return 0;
    return ["sad", "angry", "fearful"].includes(label) ? 1 : 0;
}
function severityFromR(R) {
    const t1 = Number(FUSION.cutoffs.minimal_max);
    const t2 = Number(FUSION.cutoffs.moderate_max);
    if (R <= t1) return "Minimal";
    if (R <= t2) return "Moderate";
    return "Severe";
}
// piecewise-linear isotonic transform (fallback = identity)
function isotonicTransform(x, xThr, yThr) {
    if (!Array.isArray(xThr) || !Array.isArray(yThr) || xThr.length === 0 || yThr.length === 0) return x;
    const xNum = Number(x);
    if (!Number.isFinite(xNum)) return 0;
    if (xNum <= xThr[0]) return yThr[0];
    const last = xThr.length - 1;
    if (xNum >= xThr[last]) return yThr[last];
    let lo = 0, hi = last;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (xThr[mid] < xNum) lo = mid + 1; else hi = mid - 1;
    }
    const i = lo;                   // (i-1, i]
    const x0 = xThr[i - 1], x1 = xThr[i];
    const y0 = yThr[i - 1], y1 = yThr[i];
    const denom = (x1 - x0) || 1e-12;
    const t = (xNum - x0) / denom;
    return y0 + t * (y1 - y0);
}

// ---- data fetchers ----
async function getLatestPhq9ForUser(userID) {
    const rows = await PHQ9.aggregate([
        { $match: { userID: Number(userID) } },
        { $sort: { askedAt: -1 } },
        {
            $group: {
                _id: "$questionID",
                questionID: { $first: "$questionID" },
                question: { $first: "$question" },
                score: { $first: "$score" },
                askedAt: { $first: "$askedAt" },
            },
        },
        { $project: { _id: 0, questionID: 1, question: 1, score: 1, askedAt: 1 } },
        { $sort: { questionID: 1 } },
    ]);

    const total = rows.reduce((s, r) => s + Number(r.score || 0), 0);
    const normalized = Math.min(1, Math.max(0, total / 27));
    return {
        per_question: rows,
        answered_count: rows.length,
        complete: rows.length === 9,
        total_score: total,
        normalized: round4(normalized),
    };
}

async function getLatestClassifierForUser(userID) {
    const doc = await ClassifierResult.findOne({ userID: Number(userID) }).sort({ createdAt: -1 }).lean();
    if (!doc) return null;

    return {
        depression_label: doc.depression_label,
        depression_confidence_detected: Number(doc.depression_confidence_detected || 0),
        emotion: doc.emotion,
        emotion_confidence: Number(doc.emotion_confidence || 0),
        createdAt: doc.createdAt,
        id: String(doc._id),
    };
}

// ---- main compute (pure) ----
async function computeDepressionIndexByUser(userID) {
    const [phq, clf] = await Promise.all([
        getLatestPhq9ForUser(userID),
        getLatestClassifierForUser(userID),
    ]);

    const phqNorm = phq?.normalized ?? 0;
    let clfRaw = 0, clfCal = 0, emoBin = 0;

    if (clf) {
        clfRaw = Math.min(1, Math.max(0, Number(clf.depression_confidence_detected || 0)));
        const xThr = FUSION.calibration?.x_thresholds || null;
        const yThr = FUSION.calibration?.y_thresholds || null;
        clfCal = isotonicTransform(clfRaw, xThr, yThr);
        emoBin = emotionToBinary(clf.emotion);
    }

    const w = FUSION.weights || { phq9: 0.7895, classifier: 0.1579, emotion: 0.0526 };
    const R = (w.phq9 * phqNorm) + (w.classifier * clfCal) + (w.emotion * emoBin);

    return {
        userID: Number(userID),
        weights: { phq9: round4(w.phq9), classifier: round4(w.classifier), emotion: round4(w.emotion) },
        cutoffs: {
            minimal_max: Number(FUSION.cutoffs.minimal_max),
            moderate_max: Number(FUSION.cutoffs.moderate_max),
        },
        components: {
            phq9: {
                total: phq?.total_score ?? 0,
                normalized: round4(phqNorm),
                complete: phq?.complete ?? false,
                answered_count: phq?.answered_count ?? 0,
            },
            classifier: clf ? {
                label: clf.depression_label,
                confidence_raw: round4(clfRaw),
                confidence_calibrated: round4(clfCal),
                createdAt: clf.createdAt,
                emotion: clf.emotion,
                emotion_binary: emoBin,
            } : {
                label: null, confidence_raw: 0, confidence_calibrated: 0,
                createdAt: null, emotion: null, emotion_binary: 0,
            },
        },
        R_value: round4(R),
        level: severityFromR(R),
    };
}

// ---- save helpers ----
function buildConfigHash() {
    try {
        const payload = JSON.stringify({
            weights: FUSION.weights,
            cutoffs: FUSION.cutoffs,
            calibration: FUSION.calibration,
        });
        return crypto.createHash("sha256").update(payload).digest("hex");
    } catch {
        return null;
    }
}

async function saveDepressionIndexResult(userID, computed) {
    const doc = new DepressionIndexResult({
        userID: Number(userID),
        R_value: computed.R_value,
        level: computed.level,
        components: computed.components,
        weights: computed.weights,
        cutoffs: {
            minimal_max: computed.cutoffs.minimal_max,
            moderate_max: computed.cutoffs.moderate_max,
        },
        fusion_config_meta: {
            version: FUSION.version || null,
            config_hash: buildConfigHash(),
        },
    });
    await doc.save();
    return doc;
}

// public API
async function computeAndSaveDepressionIndexByUser(userID) {
    const computed = await computeDepressionIndexByUser(userID);
    const saved = await saveDepressionIndexResult(userID, computed);
    return { computed, savedId: saved._id };
}

async function getLatestSavedIndexByUser(userID) {
    return await DepressionIndexResult
        .findOne({ userID: Number(userID) })
        .sort({ createdAt: -1 })
        .lean();
}

async function getIndexHistoryByUser(userID, limit = 10) {
    return await DepressionIndexResult
        .find({ userID: Number(userID) })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .lean();
}

module.exports = {
    computeDepressionIndexByUser,
    computeAndSaveDepressionIndexByUser,
    getLatestSavedIndexByUser,
    getIndexHistoryByUser,
};
