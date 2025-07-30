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
    required: true
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
    sparse: true
  },
  nickname: {
    type: String,
    default: ""
  },
  virtualCharacter: {
    type: Number,
    default: 1 // or any default you like
  },
  inputMode: {
    type: String,
    default: "text"
  }
});

userSchema.plugin(AutoIncrement, { inc_field: "userID" });

module.exports = mongoose.model("User", userSchema);
