const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");

const {
  signup,
  login,
  getUserDetails,
  getAuthenticatedUser,
  addUserDetails,
} = require("./handlers/users");

const {
  makeOnePost,
  deletePost,
  updatePost,
  getAllPosts,
  likePost,
  dislikePost,
  commentOnPost,
} = require("./handlers/posts");
const { authMiddleware } = require("./util/authMiddleware");

const app = express();
app.use(cors({ origin: true }));

// User Routes
app.post("/signup", signup);
app.post("/login", login);
app.get("/user/:handle", getUserDetails);
app.get("/user", authMiddleware, getAuthenticatedUser);
app.post("/user", authMiddleware, addUserDetails);

// Posts Routes
app.post("/post", authMiddleware, makeOnePost);
app.delete("/delete/:postId", authMiddleware, deletePost);
app.patch("/update/:postId", authMiddleware, updatePost);
app.get("/posts", getAllPosts);
app.post("/post/:postId/like", authMiddleware, likePost);
app.post("/post/:postId/dislike", authMiddleware, dislikePost);
app.post("/post/:postId/comment", authMiddleware, commentOnPost);

const api = functions.https.onRequest(app);

module.exports = {
  api,
};
