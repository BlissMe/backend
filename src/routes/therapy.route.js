const express = require("express");
const router = express.Router();
const Joi = require("joi");
const breathingProtocol = require("../models/breathingProtocol");
const breathingModel = require("../models/breathingModel");

router.post("/breathing/session", async (req, res) => {
  const schema = Joi.object({
    protocolId: Joi.string().required(),
    durationMinutes: Joi.number().min(1).max(60).required(),
    cyclesCompleted: Joi.number().min(0).required(),
    timestamp: Joi.string().isoDate().required(),
    rpe: Joi.number().min(0).max(10).optional(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  try {
    const doc = await breathingModel.create(value);
    res.status(201).json({ message: "Session logged", id: doc._id });
  } catch (e) {
    res.status(500).json({ message: "DB error", error: e?.message });
  }
});

router.get("/breathing/protocols", async (_req, res) => {
  const fromDb = await breathingProtocol.find().lean();
  res.json({ protocols: fromDb });
});

module.exports = router;
