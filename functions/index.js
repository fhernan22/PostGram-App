const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");

const { signup, login } = require("./handlers/users");
const { makeOnePost, deletePost, updatePost } = require("./handlers/posts");
// const { authMiddleware } = require("./util/authMiddleware");

const app = express();
app.use(cors({ origin: true }));

// User Routes
app.post("/signup", signup);
app.post("/login", login);

// Posts Routes
app.post("/post", makeOnePost);
app.delete("/delete/:postId", deletePost);
app.patch("/update/:postId", updatePost);
// app.get("/posts", getAllPosts)

const api = functions.https.onRequest(app);

module.exports = {
  api,
};
