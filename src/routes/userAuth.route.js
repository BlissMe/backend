const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { encryptText } = require("../utils/encryption");
const { sendResetEmail } = require("../utils/mailer");
const { authenticateToken } = require("../services/authentication");

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
      email: email,
      userID :newUser.userID
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
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
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
      email: email,
      userID: user.userID
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

router.post("/update-email", authenticateToken, async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ message: "New email is required" });
    }

    const encryptedNewEmail = encryptText(newEmail);

    const existingUser = await User.findOne({ email: encryptedNewEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = encryptedNewEmail;
    await user.save();

    res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    const user = await User.findOne({ userID: req.user.userID });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({ message: "New password cannot be the same as the current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/delete-account", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.user.userID });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.deleteOne({ userID: req.user.userID });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




module.exports = router;
