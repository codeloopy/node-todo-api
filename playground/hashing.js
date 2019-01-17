const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

let password = "abc123!";

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

const hashedPassword =
  "$2a$10$ATC1vedP3CDb45VJ5umV6eY8ksnpmYfFUx8XRx34d3bnRY1Yu6Q6G";

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});

// let data = {
//   id: 21
// };
//
// let token = jwt.sign(data, "lucarin"); //takes 2 args: (the object, the secret)
// console.log(token);
//
// let decoded = jwt.verify(token, "lucarin");
// console.log(decoded);

// const message = "I am use number 21";
//
// const hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// let data = {
//   id: 4
// };
//
// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// };

/*
// someone tries to manipulate the hash
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();
*/

// let resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString();
//
// if (resultHash === token.hash) {
//   console.log("Data was not manipulated");
// } else {
//   console.log("Data was manipulated, PROCEED WITH CAUTION!");
// }
