const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

const id = "5c3683a93d595b533373203d11";
// if (!ObjectID.isValid(id)) {
//   console.log("Not a valid ID");
// }
//
// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log("Todos ", todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log("Todo ", todo);
// });
//
// Todo.findById(id)
//   .then(todo => {
//     if (!todo) {
//       return console.log("ID not found!");
//     }
//     console.log("Todo by ID", todo);
//   })
//   .catch(e => {
//     console.log(e);
//   });

const userID = "5c3527d0cd07f8125a1acc7d11";

User.findById(userID)
  .then(user => {
    if (!user) {
      console.log("User not found");
    }
    console.log(JSON.stringify(user, undefined, 2));
  })
  .catch(e => {
    console.log("There was an error with the ID");
    console.log(e.message);
  });
