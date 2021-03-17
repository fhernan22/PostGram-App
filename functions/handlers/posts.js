const { db } = require("../util/admin");

exports.makeOnePost = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newPost = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
    userImage: req.user.imageUrl,
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("posts")
    .add(newPost)
    .then((doc) => {
      const resPost = newPost;
      resPost.postId = doc.id;

      res.json(resPost);
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong" });
      console.error("Somethig went wrong");
    });
};

exports.deletePost = (req, res) => {
  const document = db.doc(`/posts/${req.params.postId}`);

  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Post deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.updatePost = (req, res) => {
  const document = db.doc(`/posts/${req.params.postId}`);

  document
    .update({ body: req.body.body })
    .then(() => {
      return res.json({ message: "Post updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

//=========================Ginel=========================//

// exports.getAllPosts = (req, res) => {
// Run a query that gets all documents in the posts collection
// ordered by createdAt in descending order
// loop through each document that the query returns
// push content of the document to
//  variable (body, userHandle, createdAt, commentCount, likeCount, userImage, and screamId)
// return json object in the response with the variable containing
// all documents
// if there's an error return a status code of 500 and a
// the following json { error: err.code }
// };

//=======================================================//
