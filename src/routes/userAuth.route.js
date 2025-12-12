const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { encryptText } = require("../utils/encryption");
const { sendResetEmail } = require("../utils/mailer");
const { authenticateToken } = require("../services/authentication");
const { encryptArray, decryptArray } = require("../utils/faceAuthEncryption");

require("dotenv").config();

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, password ,securityQuestion, securityAnswer } = req.body;

    if (!securityQuestion || !securityAnswer) {
      return res
        .status(400)
        .json({ message: "Security question and answer are required." });
    }

    const encryptedUsername = encryptText(username);

    const existingUser = await User.findOne({ username: encryptedUsername });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists." });

    const newUser = new User({
      username: encryptedUsername,
      password,
      securityQuestion,
      securityAnswer,
    });

    await newUser.save();

    const token = jwt.sign(
      { userID: newUser.userID, username: newUser.username },
      process.env.ACCESS_TOKEN,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Successfully Registered",
      token,
      username: username,
      userID: newUser.userID,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Encrypt the username before querying the DB
    const encryptedusername = encryptText(username);

    const user = await User.findOne({ username: encryptedusername });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    const token = jwt.sign(
      { userID: user.userID, username: user.username, role: user.role },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      username: username,
      userID: user.userID,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const euclideanDistance = (arr1, arr2) => {
  return Math.sqrt(
    arr1.reduce((sum, val, i) => sum + Math.pow(val - arr2[i], 2), 0)
  );
};

router.post("/face-register", async (req, res) => {
  try {
    const { username, descriptor } = req.body;

    if (!username || !descriptor) {
      return res
        .status(400)
        .json({ message: "username and descriptor required" });
    }

    const encryptedusername = encryptText(username);
    const user = await User.findOne({ username: encryptedusername });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.faceDescriptor = encryptArray(descriptor);
    await user.save();

    res.status(200).json({ message: "Face registered successfully" });
  } catch (error) {
    console.error("Face register error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/face-login", async (req, res) => {
  try {
    const { descriptor } = req.body;

    if (!descriptor) {
      return res.status(400).json({ message: "Descriptor is required" });
    }

    const usersWithDescriptors = await User.find({
      faceDescriptor: { $ne: null },
    });

    const threshold = 0.45;
    let matchedUser = null;

    for (let user of usersWithDescriptors) {
      if (!user.faceDescriptor) continue; // extra safety check

      try {
        const storedDescriptor = decryptArray(user.faceDescriptor);
        if (storedDescriptor && storedDescriptor.length === descriptor.length) {
          const distance = euclideanDistance(descriptor, storedDescriptor);
          if (distance < threshold) {
            matchedUser = user;
            break;
          }
        }
      } catch (e) {
        console.error("Decryption failed for user:", user.userID, e.message);
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ message: "Face not recognized" });
    }

    const token = jwt.sign(
      { userID: matchedUser.userID, username: matchedUser.username },
      process.env.ACCESS_TOKEN,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      username: matchedUser.username,
      userID: matchedUser.userID,
    });
  } catch (err) {
    console.error("Face login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required." });
    }

    const encryptedUsername = encryptText(username);
    const user = await User.findOne({ username: encryptedUsername });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return only the security question
    res.status(200).json({
      message: "User found. Please answer the security question.",
      securityQuestion: user.securityQuestion,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-security-answer", async (req, res) => {
  try {
    const { username, securityAnswer } = req.body;

    if (!username || !securityAnswer) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const encryptedUsername = encryptText(username);
    const user = await User.findOne({ username: encryptedUsername });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isAnswerCorrect = await bcrypt.compare(securityAnswer, user.securityAnswer);
    if (!isAnswerCorrect) {
      return res.status(400).json({ message: "Incorrect security answer." });
    }

    const resetToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      message: "Security answer verified. You can reset your password.",
      resetToken,
    });
  } catch (error) {
    console.error("Verify security answer error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required." });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const encryptedUsername = decoded.username;

    const user = await User.findOne({ username: encryptedUsername });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash new password and save
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
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).json({ message: "New username is required" });
    }

    const encryptedNewUserName = encryptText(newUsername);

    const existingUser = await User.findOne({ email: encryptedNewUserName });
    if (existingUser) {
      return res.status(400).json({ message: "Username already in use" });
    }

    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = encryptedNewUserName;
    await user.save();

    res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new passwords are required" });
    }

    const user = await User.findOne({ userID: req.user.userID });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        message: "New password cannot be the same as the current password",
      });
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
