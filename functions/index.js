const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");


const app = express();
app.use(cors({ origin: true }));

app.get("/helloworld", (req, res) => {
  res.send("Hello World! May the force be with you!");
});

const api = functions.https.onRequest(app);

module.exports = {
  api,
};


// get request
// post request



