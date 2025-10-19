require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/userModel");
const { encryptText } = require("./src/utils/encryption");

async function createDoctor() {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("MongoDB connected successfully");
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
      });

    const email = process.env.DOCTOR_EMAIL;
    const password = process.env.DOCTOR_PASSWORD;

    const encryptedEmail = encryptText(email);
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ email: encryptedEmail });
    if (existing) {
      console.log("Doctor already exists!");
      process.exit(0);
    }

    const doctor = new User({
      email: encryptedEmail,
      password: hashedPassword,
      role: "doctor",
    });

    await doctor.save();
    console.log("Doctor account created su!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createDoctor();
