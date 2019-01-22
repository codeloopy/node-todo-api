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
app.delete("/todos/:id", authenticate, (req, res) => {
  // get the id
  const id = req.params.id;

  //validate ID -> not valid? return 404
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  //remove by id -> success if no doc, send 404, if doc send doc with 200
  // error(empty body and status 400)
  Todo.findOneAndDelete({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
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
      res.status(400).send();
    });
});

// POST/USERS - Create user

app.post("/users", (req, res) => {
  const body = _.pick(req.body, ["name", "email", "password"]);
  const user = new User(body);

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header("x-auth", token).send(user);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

// Get all Users

app.get("/users", (req, res) => {
  User.find().then(
    users => {
      res.send({ users });
    },
    e => {
      res.status(400).send();
    }
  );
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login {email, password}
// setup route, pick email and password off from the req. and to verify
// use res.send to send back the body data

app.post("/users/login", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header("x-auth", token).send(user);
      });
    })
    .catch(e => {
      res.status(400).send();
    });
});

// logout user

app.delete("/users/me/token", authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send();
    },
    () => {
      res.status(400).send();
    }
  );
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
