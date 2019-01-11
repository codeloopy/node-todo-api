const expect = require("expect");
const request = require("supertest");
const { ObjectId } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");

const todos = [
  {
    _id: new ObjectId(),
    text: "First test todo"
  },
  {
    _id: new ObjectId(),
    text: "Second test todo"
  }
];

const newBlankObjID = new ObjectId();

beforeEach(done => {
  // Todo.remove({}).then(() => done());  //remove is depricated
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
});

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
