const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userID: {
    type: Number,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  nickname: {
    type: String,
    default: "pinky",
  },
  virtualCharacter: {
    type: String,
    default: "cat",
  },
  inputMode: {
    type: String,
    default: "text",
  },
  faceDescriptor: {
    type: String,
    default: null,
  },
  role: { type: String, enum: ["patient", "doctor"], default: "patient" },

  securityQuestion: {
    type: String,
    required: true,
  },
  securityAnswer: {
    type: String,
    required: true,
  },
});

// Hash password and security answer before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified("securityAnswer")) {
    this.securityAnswer = await bcrypt.hash(this.securityAnswer, 10);
  }
  next();
});

userSchema.plugin(AutoIncrement, { inc_field: "userID" });

module.exports = mongoose.model("User", userSchema);
