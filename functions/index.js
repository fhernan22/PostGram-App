const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");

const { signup, login } = require("./handlers/users");

const app = express();
app.use(cors({ origin: true }));

// User Routes
app.post("/signup", signup);
app.post("/login", login);

const api = functions.https.onRequest(app);

module.exports = {
  api,
};
