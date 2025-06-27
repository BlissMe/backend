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
      // Require password only if googleId is not set
      return !this.googleId;
    },
  },  
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

});
userSchema.plugin(AutoIncrement, { inc_field: "userID" });

module.exports = mongoose.model("User", userSchema);
