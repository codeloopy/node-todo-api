const mongoose = require("mongoose");

//setup mongoose to use promises, mongoose by default uses callbacks
mongoose.Promise = global.Promise;

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
);

module.exports = { mongoose };
