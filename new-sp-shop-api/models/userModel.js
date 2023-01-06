const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Kindly input user name"],
    trim: true,
    minlength: [3, "Name cannot be less than 3 characters"],
    maxlength: [20, "Name cannot be more than 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Kindly input user email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email address",
    },
  },
});

module.exports = mongoose.model("User", UserSchema);
