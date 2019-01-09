const mongoose = require("mongoose");

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
    minlength: 10
  }
});

module.exports = { User };
