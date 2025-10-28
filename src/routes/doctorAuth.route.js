const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Doctor = require("../models/doctorAuthModel");
const { encryptText } = require("../utils/encryption");
const { sendResetEmail } = require("../utils/mailer");
const { authenticateToken } = require("../services/authentication");

require("dotenv").config();

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const encryptedEmail = encryptText(email);
    const encryptedUsername = encryptText(username);
    // Check if email exists
    const existingDoctor = await Doctor.findOne({ email: encryptedEmail });
    if (existingDoctor) {
      return res.status(400).json({ message: "Email already exists." });
    }
    // Check if username exists
    const existingUsername = await Doctor.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // Create new doctor
    const newDoctor = new Doctor({
      email: encryptedEmail,
      username: encryptedUsername,
      password,
    });

    await newDoctor.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        doctorID: newDoctor.doctorID,
        username: username,
        role: newDoctor.role,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "8h" }
    );

    res.status(201).json({
      status: 0,
      message: "Successfully Registered",
      data: {
        token,
        email,
        username,
        doctorID: newDoctor.doctorID,
        role: newDoctor.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ status: -1, message: "Server error", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required." });

    const encryptedusername = encryptText(username);

    const doctor = await Doctor.findOne({ username: encryptedusername });
    console.log(doctor);
    if (!doctor) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password." });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password." });
    }

    const token = jwt.sign(
      { doctorID: doctor.doctorID, username: username, role: doctor.role },
      process.env.ACCESS_TOKEN,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      status: 0,
      message: "Login successful",
      data: {
        token,
        username,
        doctorID: doctor.doctorID,
        role: doctor.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ status:-1, message: "Server error", error });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const encryptedEmail = encryptText(email);
    const doctor = await doctorAuthModel.findOne({ email: encryptedEmail });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const resetToken = jwt.sign(
      { email: doctor.email },
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

    const doctor = await doctor.findOne({ email });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    doctor.password = hashedPassword;
    await doctor.save();

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

    const existingdoctor = await doctor.findOne({ email: encryptedNewEmail });
    if (existingdoctor) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const doctor = await doctor.findOne({ doctorID: req.doctor.doctorID });
    if (!doctor) {
      return res.status(404).json({ message: "doctor not found" });
    }

    doctor.email = encryptedNewEmail;
    await doctor.save();

    res.status(200).json({ message: "Email updated successfully" });
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

    const doctor = await doctor.findOne({ doctorID: req.doctor.doctorID });

    if (!doctor) {
      return res.status(404).json({ message: "doctor not found" });
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      doctor.password
    );
    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, doctor.password);
    if (isSameAsOld) {
      return res.status(400).json({
        message: "New password cannot be the same as the current password",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    doctor.password = hashedNewPassword;
    await doctor.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/delete-account", authenticateToken, async (req, res) => {
  try {
    const doctor = await doctor.findOne({ doctorID: req.doctor.doctorID });

    if (!doctor) {
      return res.status(404).json({ message: "doctor not found" });
    }

    await doctor.deleteOne({ doctorID: req.doctor.doctorID });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
