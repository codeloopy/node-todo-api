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

//Todo.findByIdAndRemve(); //returns the deleted doc

Todo.findByIdAndRemove("5c38025f67dfe9bdbbdeacd6").then(todo => {
  console.log(todo);
});
