const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema({
  doctorID: {
    type: Number,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: { 
    type: [String],
    default: ["doctor"],
  },
});

// Hash password before saving
doctorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

doctorSchema.plugin(AutoIncrement, { inc_field: "doctorID" });

module.exports = mongoose.model("Doctor", doctorSchema);
