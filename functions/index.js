const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");

const { signup, login, getUserDetails } = require("./handlers/users");
const {
  makeOnePost,
  deletePost,
  updatePost,
  getAllPosts,
} = require("./handlers/posts");
const { authMiddleware } = require("./util/authMiddleware");

const app = express();
app.use(cors({ origin: true }));

// User Routes
app.post("/signup", signup);
app.post("/login", login);
app.get("/:handle", getUserDetails);

// Posts Routes
app.post("/post", authMiddleware, makeOnePost);
app.delete("/delete/:postId", authMiddleware, deletePost);
app.patch("/update/:postId", authMiddleware, updatePost);
app.get("/posts", getAllPosts);

const api = functions.https.onRequest(app);

module.exports = {
  api,
};
