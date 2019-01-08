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

    //findOneAndUpdate
    /*
    db.collection("Todos")
      .findOneAndUpdate(
        {
          _id: ObjectId("5c34ec1c3b0d07ef2b650666")
        },
        {
          $set: {
            text: "Pickup some food for dinner",
            completed: true
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(
        result => {
          console.log("Record Updated", result);
        },
        err => {
          console.log("ERROR", err);
        }
      ); */

    // Update User name and increment age by 1
    db.collection("Users")
      .findOneAndUpdate(
        {
          _id: ObjectId("5c33ad6e829edab31b49d93a")
        },
        {
          $set: {
            name: "Lucarin Piroulin"
          },
          $inc: {
            age: 1
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(
        result => {
          console.log("Modified", result);
        },
        err => {
          console.log("ERROR", err);
        }
      );

    // db.collection("Users")
    //   .findOneAndUpdate(
    //     {
    //       _id: ObjectId("5c33ad6e829edab31b49d93a")
    //     },
    //     {
    //       $inc: {
    //         age: 1
    //       }
    //     },
    //     {
    //       returnOriginal: false
    //     }
    //   )
    //   .then(
    //     result => {
    //       console.log("Modified", result);
    //     },
    //     err => {
    //       console.log("ERROR", err);
    //     }
    //   );

    client.close();
  }
);
