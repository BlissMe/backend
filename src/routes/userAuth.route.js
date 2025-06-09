const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { encryptText } = require("../utils/encyption");

require("dotenv").config();

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const encryptedEmail = encryptText(email);
    const existingUser = await User.findOne({ email :encryptedEmail});
    if (existingUser) return res.status(400).json({ message: "Email already exists." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email:encryptedEmail, password: hashedPassword });
    await newUser.save();
    res.status(200).json({ message: "Successfully Registered" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    if (user.status === "false") {
      return res.status(401).json({ message: "Wait for admin approval" });
    }
    const token = jwt.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN, { expiresIn: "8h" });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
