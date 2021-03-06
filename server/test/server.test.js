const expect = require("expect");
const request = require("supertest");
const { ObjectId } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { todos, populateTodos, users, populateUsers } = require("./seed/seed");
const { User } = require("./../models/user");

const newBlankObjID = new ObjectId();

beforeEach(populateUsers);
beforeEach(populateTodos);

// CREATE/POST

describe("POST /todos", () => {
  it("Should create a new todo", done => {
    const text = "Test todo text";

    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
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
      .set("x-auth", users[0].tokens[0].token)
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
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

// GET a single Post

describe("GET /todos/:id", () => {
  it("should return a todo with an id", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should not return a todo with an another user id", done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return a 404 if todo not found", done => {
    request(app)
      .get(`/todos/${newBlankObjID.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return a 404 if invalid Id", done => {
    request(app)
      .get("/todos/123abc")
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

// DELETE/REMOVE a post

describe("DELETE /todos/:id", () => {
  it("should remove a todo", done => {
    const hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
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

  it("should not remove a todo by someone else", done => {
    const hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // query db using findById and toNotExist
        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toBeTruthy(); // expect(todo).toNotExist();
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should return a 404 if todo not found", done => {
    request(app)
      .delete(`/todos/${newBlankObjID.toHexString()}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return a 404 if todo id is invalid", done => {
    request(app)
      .delete("/todos/123abc")
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

// UPDATE test

describe("PATCH /todos/:id", () => {
  it("should update todo by the user", done => {
    const updateText = "the new test update text";
    // grab ID of first item
    const hexId = todos[0]._id.toHexString();

    //update text, set completed to true
    request(app)
      .patch(`/todos/${hexId}`)
      .set("x-auth", users[0].tokens[0].token)
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

  it("should not update the todo created by another user", done => {
    const updateText = "the new test update text";
    // grab ID of first item
    const hexId = todos[0]._id.toHexString();

    //update text, set completed to true
    request(app)
      .patch(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({
        text: updateText,
        completed: true,
        completedAt: 213
      })
      .expect(404) //200 back
      .end(done);
  });

  it("should clear completedAt when todo isn't completed", done => {
    const newTxt = "blah blah blah";
    // grab ID of second todo item
    const hexId = todos[1]._id.toHexString();
    //update text, set completed to false
    request(app)
      .patch(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
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

describe("GET /users/me", () => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return a 401 if not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("should create a user", done => {
    const name = "SomeName";
    const email = "example@email.com";
    const password = "123pjm!";

    request(app)
      .post("/users")
      .send({ name, email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeTruthy(); // toExists is depricated use: toBeTruthy()
        expect(res.body._id).toBeTruthy();
        expect(res.body.name).toBe(name);
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }

        User.findOne({ email })
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch(e => done());
      });
  });

  it("should return validation error if request invalid", done => {
    // send invalid email and passsword expect a 400
    const name = "";
    const email = "emailcom";
    const password = "pjm";

    request(app)
      .post("/users")
      .send({ name, email, password })
      .expect(400)
      .end(done);
  });

  it("should not create user if email is in use", done => {
    // should fail when there an email already in use or invalid pass, expect 400
    request(app)
      .post("/users")
      .send({
        email: users[0].email,
        password: "Password123!"
      })
      .expect(400)
      .end(done);
  });
});

describe("POST users/login", () => {
  it("should login user and retun auth token", done => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[1]).toMatchObject({
              access: "auth",
              token: res.headers["x-auth"]
            });
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should reject invalid login", done => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: users[1].password + "123"
      })
      .expect(400)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("DELETE /users/me/token", () => {
  it("should remove auth token on logout", done => {
    request(app)
      .delete("/users/me/token")
      .set("x-auth", users[0].tokens[0].token) //setting x-auth to the value we want to use
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
    // 200
    // find user in DB and verify that token array has length of 0
  });
});
