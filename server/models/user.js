const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const UserSchema = new mongoose.Schema({
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

UserSchema.methods.toJSON = function() {
  const user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ["_id", "email", "name"]);
};

UserSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = "auth";
  let token = jwt
    .sign({ _id: user._id.toHexString(), access }, "abc123")
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => {
    return token;
  });
};

const User = mongoose.model("Users", UserSchema);

module.exports = { User };
