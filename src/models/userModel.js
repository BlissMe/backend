const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },

  password: {
    type: String,
    required: function () {
      // Require password only if googleId is not set
      return !this.googleId;
    },
  },
  googleId: { type: String, unique: true, sparse: true },


});

module.exports = mongoose.model("User", userSchema);
