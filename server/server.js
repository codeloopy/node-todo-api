const mongoose = require("mongoose");

//setup mongoose to use promises, mongoose by default uses callbacks
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/TodoApp");

const Todo = mongoose.model("Todo", {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

const newTodo = new Todo({
  text: "Make some dinner",
  type: false,
  completedAt: new Date()
});

newTodo.save().then(
  todo => {
    console.log("Todo created", todo);
  },
  err => {
    console.log("ERROR - Unable to save", err);
  }
);
