const mongoose = require("mongoose");

const PhqSchema = new mongoose.Schema({
    total: { type: Number, required: true },
    normalized: { type: Number, required: true }, // 0..1
    complete: { type: Boolean, required: true },
    answered_count: { type: Number, required: true },
}, { _id: false });

const ClassifierSchema = new mongoose.Schema({
    label: { type: String },
    confidence_raw: { type: Number },        // 0..1
    confidence_calibrated: { type: Number }, // 0..1
    createdAt: { type: Date },
    emotion: { type: String, enum: ["happy", "neutral", "sad", "angry", "fearful"], default: "neutral" },
    emotion_binary: { type: Number, min: 0, max: 1, default: 0 },
}, { _id: false });

const DepressionIndexResultSchema = new mongoose.Schema({
    userID: { type: Number, required: true, index: true },

    R_value: { type: Number, required: true }, // fused 0..1
    level: { type: String, enum: ["Minimal", "Moderate", "Severe"], required: true },

    components: {
        phq9: { type: PhqSchema, required: true },
        classifier: { type: ClassifierSchema, required: true },
    },

    weights: {
        phq9: { type: Number, required: true },
        classifier: { type: Number, required: true },
        emotion: { type: Number, required: true },
    },

    cutoffs: {
        minimal_max: { type: Number, required: true },
        moderate_max: { type: Number, required: true },
    },

    fusion_config_meta: {
        version: { type: String },     // optional, if present in config
        config_hash: { type: String }, // sha256 of weights+cutoffs+calibration
    },

    createdAt: { type: Date, default: Date.now, index: true },
}, { collection: "depressionIndexResults" });

module.exports = mongoose.model("DepressionIndexResult", DepressionIndexResultSchema);
