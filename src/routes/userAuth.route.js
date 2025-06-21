const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { encryptText } = require("../utils/encryption");

require("dotenv").config();

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const encryptedEmail = encryptText(email);
    const existingUser = await User.findOne({ email: encryptedEmail });
    if (existingUser) return res.status(400).json({ message: "Email already exists." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email: encryptedEmail, password: hashedPassword });
    await newUser.save();
    res.status(200).json({ message: "Successfully Registered" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Encrypt the email before querying the DB
    const encryptedEmail = encryptText(email);

    const user = await User.findOne({ email: encryptedEmail });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = jwt.sign({ userID: user.userID, email: user.email }, process.env.ACCESS_TOKEN, {
      expiresIn: "8h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



module.exports = router;
