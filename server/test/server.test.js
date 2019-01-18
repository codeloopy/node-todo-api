const expect = require("expect");
const request = require("supertest");
const { ObjectId } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { todos, populateTodos, users, populateUsers } = require("./seed/seed");

const newBlankObjID = new ObjectId();

beforeEach(populateUsers);
beforeEach(populateTodos);

// CREATE/POST

describe("POST /todos", () => {
  it("Should create a new todo", done => {
    const text = "Test todo text";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("Should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

// GET ALL TODOS

describe("GET /todos", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

// GET a single Post

describe("GET /todos/:id", () => {
  it("should return a todo with an id", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should return a 404 if todo not found", done => {
    request(app)
      .get(`/todos/${newBlankObjID.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("should return a 404 if invalid Id", done => {
    request(app)
      .get("/todos/123abc")
      .expect(404)
      .end(done);
  });
});

// DELETE/REMOVE a post

describe("DELETE /todos/:id", () => {
  it("should remove a todo", done => {
    const hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // query db using findById and toNotExist
        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toBeFalsy();
            // expect(todo).toNotExist();
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should return a 404 if todo not found", done => {
    request(app)
      .delete(`/todos/${newBlankObjID.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("should return a 404 if todo id is invalid", done => {
    request(app)
      .delete("/todos/123abc")
      .expect(404)
      .end(done);
  });
});

// UPDATE test

describe("PATCH /todos/:id", () => {
  it("should return 200 after update", done => {
    const updateText = "the new test update text";
    // grab ID of first item
    const hexId = todos[0]._id.toHexString();

    //update text, set completed to true
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text: updateText,
        completed: true,
        completedAt: 213
      })
      .expect(200) //200 back
      .expect(res => {
        expect(res.body.todo.text).toBe(updateText); // custom assertion: text is changed, completed is true, completedAt is a number .toBeA()
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe("number");
      })
      .end(done);
  });

  it("should clear completedAt when todo isn't completed", done => {
    const newTxt = "blah blah blah";
    // grab ID of second todo item
    const hexId = todos[1]._id.toHexString();
    //update text, set completed to false
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        // text is changed, completed is false, completedAt is null .toNotExist()
        text: newTxt,
        completed: false
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(false);
        // expect(res.body.todo.completedAt).toBe(null);
        expect(res.body.todo.completedAt).toBe(null);
        expect(res.body.todo.text).toBe(newTxt);
      })
      .end(done); //200 back
  });
});
