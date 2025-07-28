const express = require("express");
const userDetails = require("../models/userDetails");
const userModel = require("../models/userModel");
const router = express.Router();

router.post("/details", async (req, res) => {
  try {
    const { virtualName, character, inputMethod, userId } = req.body;

    if (!virtualName || !character || !inputMethod || !userId) {
      return res.status(400).json({
        error: "Missing required fields: virtualName, character, inputMethod, or userId",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingDetails = await userDetails.findOne({ userId });

    if (existingDetails) {
      existingDetails.virtualName = virtualName;
      existingDetails.character = character;
      existingDetails.inputMethod = inputMethod;
      await existingDetails.save();
    } else {
      const details = new userDetails({
        userId,
        virtualName,
        character,
        inputMethod,
      });
      await details.save();
    }

    return res.status(200).json({ message: "User details saved successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
});
module.exports = router;
