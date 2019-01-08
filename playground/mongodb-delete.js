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

    // deleteMany()
    // db.collection("Todos")
    //   .deleteMany({ text: "Eat dinner" })
    //   .then(
    //     result => {
    //       console.log(result);
    //     },
    //     err => {
    //       console.log("Error ", err);
    //     }
    //   );

    //deleteOne()
    // db.collection("Todos")
    //   .deleteOne({ text: "Eat dinner" })
    //   .then(
    //     result => {
    //       console.log("Deleted a single item", result);
    //     },
    //     err => {
    //       console.log("Error", err);
    //     }
    //   );

    //findOneAndDelete()
    // db.collection("Todos")
    //   .findOneAndDelete({ completed: false })
    //   .then(result => {
    //     console.log(result);
    //   });

    //*** CHALLENGE ***
    // remove duplicate user records

    // db.collection("Users")
    //   .deleteMany({ name: "Pedro" })
    //   .then(
    //     result => {
    //       console.log("Duplicate items Deleted");
    //     },
    //     err => {
    //       console.log("ERROR ", err);
    //     }
    //   );

    db.collection("Users")
      .findOneAndDelete({ _id: ObjectId("5c33ad9b829edab31b49d941") })
      .then(
        result => {
          console.log("Single item Deleted ", result);
        },
        err => {
          console.log("ERROR ", err);
        }
      );

    // client.close();
  }
);
