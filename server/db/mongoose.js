const mongoose = require("mongoose");

//setup mongoose to use promises, mongoose by default uses callbacks
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/TodoApp");

module.exports = { mongoose };
