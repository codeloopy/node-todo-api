const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("./../../models/todo");
const { User } = require("./../../models/user");

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [
  {
    _id: userOneId,
    name: "User Number1",
    email: "mailUno@email.com",
    password: "user1pass",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: "auth" }, "abc123").toString()
      }
    ]
  },
  {
    _id: userTwoId,
    name: "User Number2",
    email: "mailDos@email.com",
    password: "user2pass"
  }
];

const todos = [
  {
    _id: new ObjectId(),
    text: "First test todo"
  },
  {
    _id: new ObjectId(),
    text: "Second test todo",
    completed: true,
    completedAt: 333
  }
];

const populateTodos = done => {
  // Todo.remove({}).then(() => done());  //remove is depricated
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
};

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      // Promise.all([userOne, userTwo]);
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
