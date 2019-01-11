const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");

const app = express();
const port = process.env.PORT || 3000;

// app.use("view-engine", "");
app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  let todo = new Todo({
    text: req.body.text
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
app.get("/todos", (req, res) => {
  Todo.find().then(
    todos => {
      res.send({ todos });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

// Fetch Todo with ID
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  // Validate ID
  if (!ObjectID.isValid(id)) {
    //respond with 404 if not valid
    return res.status(404).send();
  }

  // findById
  Todo.findById(id)
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

app.listen(port, () => {
  console.log(`Started on port: ${port}`);
});

module.exports = { app };
