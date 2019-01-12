const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("Users", {
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{value} is not a valid email"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  tokens: [
    {
      access: {
        type: String,
        require: true
      },
      token: {
        type: String,
        require: true
      }
    }
  ]
});

module.exports = { User };
