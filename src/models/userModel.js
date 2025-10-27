const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
  userID: {
    type: Number,
    unique: true,
  },
  email: {
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
    default: "",
  },
  virtualCharacter: {
    type: String,
    default: "cat", // or any default you like
  },
  inputMode: {
    type: String,
    default: "text",
  },
  languageMode: {
    type: String,
    default: "English",
  },
  
  faceDescriptor: {
    type: String,
    default: null,
  },
  role: { type: String, enum: ["patient", "doctor"], default: "patient" },
});

userSchema.plugin(AutoIncrement, { inc_field: "userID" });

module.exports = mongoose.model("User", userSchema);
