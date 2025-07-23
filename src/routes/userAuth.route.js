const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { encryptText } = require("../utils/encryption");
const { sendResetEmail } = require("../utils/mailer");

require("dotenv").config();

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, authType } = req.body;

    const encryptedEmail = encryptText(email);
    const existingUser = await User.findOne({ email: encryptedEmail });

    if (existingUser)
      return res.status(400).json({ message: "Email already exists." });

    let newUser;

    if (authType === "normal") {
      const hashedPassword = await bcrypt.hash(password, 10);
      newUser = new User({ email: encryptedEmail, password: hashedPassword });
    } else if (authType === "face") {
      newUser = new User({ email: encryptedEmail, authType: "face" });
    } else {
      return res.status(400).json({ message: "Invalid signup type." });
    }

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userID: newUser.userID, email: newUser.email },
      process.env.ACCESS_TOKEN,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      message: "Successfully Registered",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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

    const token = jwt.sign(
      { userID: user.userID, email: user.email },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "8h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const encryptedEmail = encryptText(email);
    const user = await User.findOne({ email: encryptedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "15m",
      }
    );

    await sendResetEmail(email, resetToken);

    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const email = decoded.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
