const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

// Todo.remove({//passin_querie})
// Todo.remove({}).then(result => {
//   console.log(result);
// });

// Todo.findOneAndRemove(); //returns the deleted doc

// Todo.findOneAndRemove({ _id: "5c38025f67dfe9bdbbdeacd6" }).then(todo => {
//   console.log(todo);
// });

//Todo.findByIdAndRemove(); //returns the deleted doc - This is depricated use findByIdAndDelete();

Todo.findByIdAndDelete("5c38025f67dfe9bdbbdeacd6").then(todo => {
  console.log(todo);
});
