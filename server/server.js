require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const { authenticate } = require("./middleware/authenticate");

const app = express();
const port = process.env.PORT;

// app.use("view-engine", "");
app.use(bodyParser.json());

// CREATE a todo
app.post("/todos", authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then(
    doc => {
      res.send(doc);
    },
    err => {
      res.status(400).send(err);
    }
  );
});

// Fetch all Todos
app.get("/todos", authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(
    todos => {
      res.send({ todos });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

// Fetch Todo with ID
app.get("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id;

  // Validate ID
  if (!ObjectID.isValid(id)) {
    //respond with 404 if not valid
    return res.status(404).send();
  }

  // findById
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      // if success (send it back)
      if (!todo) {
        // otherwise send back 404 with empty body and message
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      // error (400 and send empty body back)
      res.status(400).send();
    });
});

// Delete a Todo
app.delete("/todos/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    const todo = await Todo.findOneAndDelete({
      _id: id,
      _creator: req.user._id
    });

    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo });
  } catch (e) {
    res.status(400).send(e);
  }
});

//Modify // TODO:
app.patch("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["text", "completed"]);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(
    { _id: id, _creator: req.user._id },
    {
      $set: body
    },
    { new: true }
  )
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

// POST/USERS - Create user

app.post("/users", async (req, res) => {
  try {
    const body = _.pick(req.body, ["name", "email", "password"]);
    const user = new User(body);
    await user.save();
    const token = user.generateAuthToken();
    res.header("x-auth", token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all Users

app.get("/users", (req, res) => {
  User.find().then(
    users => {
      res.send({ users });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login {email, password}
// setup route, pick email and password off from the req. and to verify
// use res.send to send back the body data

app.post("/users/login", async (req, res) => {
  try {
    const body = _.pick(req.body, ["email", "password"]);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// logout user

app.delete("/users/me/token", authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

/* ***************** */
/*                   */
/*    SERVER RUN     */
/*                   */
/* ***************** */

// Server run
app.listen(port, () => {
  console.log(`Started on port: ${port}`);
});

module.exports = { app };
