const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to MongoDB", {
        useNewUrlParser: true
      });
    }

    console.log("Connected to MongoDB");
    const db = client.db("TodoApp");

    // db.collection("Todos").insertOne(
    //   {
    //     text: "My first todo",
    //     completed: false
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert todo");
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //   }
    // );

    db.collection("User").insertOne(
      {
        name: "Pedro",
        age: 44,
        location: "Florida"
      },
      (error, result) => {
        if (error) {
          return console.log("Unable to save the user", err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
      }
    );

    client.close();
  },
  { useNewUrlParser: true }
);
