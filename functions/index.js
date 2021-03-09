const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");

const { signup } = require("./handlers/users");

const app = express();
app.use(cors({ origin: true }));

// User Routes
app.post("/signup", signup);

const api = functions.https.onRequest(app);

module.exports = {
  api,
};
