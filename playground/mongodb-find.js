// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectId } = require("mongodb"); //destructuring mongodb

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to MongoDB");
    }

    console.log("Connected to MongoDB");
    const db = client.db("TodoApp");

    console.log(
      // db
      //   .collection("Todos")
      //   // .find() //this queries everything
      //   .find({
      //     _id: new ObjectId("5c32b969e7673eaa4aa15d36")
      //   })
      //   // .find({ completed: false }) //passing an argument fetches the completed with false
      //   .toArray()
      //   .then(
      //     docs => {
      //       console.log(JSON.stringify(docs, undefined, 2));
      //     },
      //     err => {
      //       console.log("Unable to retrieve anything", err);
      //     }
      //   )
      // db
      //   .collection("Todos")
      //   .find()
      //   .count()
      //   .then(
      //     count => {
      //       console.log(`Todos count: ${count}`);
      //     },
      //     err => {
      //       console.log("Unable to retrieve anything", err);
      //     }
      //   )
      db
        .collection("User")
        .find({ name: "Pedro" })
        .toArray()
        // .count()
        .then(
          docs => {
            console.log(JSON.stringify(docs, undefined, 2));
          },
          err => {
            console.log("Error!");
          }
        )
    );

    client.close();
  },
  { useNewUrlParser: true }
);
