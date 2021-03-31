const { db } = require("../util/admin");

exports.makeOnePost = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newPost = {
    body: req.body.body,
    fullName: req.user.fullName,
    userHandle: req.user.handle,
    userId: req.user.user_id,
    createdAt: new Date().toISOString(),
    userImage: req.user.imageUrl,
    likeCount: 0,
    dislikeCount: 0,
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

exports.getAllPosts = (req, res) => {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then((querySnapshot) => {
      let info = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      res.json(info);
    })

    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.likePost = (req, res) => {
  const likeDocument = db
    .collection("reactions")
    .where("userHandle", "==", req.user.handle)
    .where("postId", "==", req.params.postId)
    .limit(1);

  const postDocumnet = db.doc(`/posts/${req.params.postId}`);

  let postData;

  postDocumnet
    .get()
    .then((doc) => {
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Post not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("reactions")
          .add({
            postId: req.params.postId,
            userHandle: req.user.handle,
            state: 1, // A state of 1 represents a like
          })
          .then(() => {
            postData.likeCount++;
            return postDocumnet.update({ likeCount: postData.likeCount });
          })
          .then(() => {
            return res.json(postData);
          });
      } else {
        if (data.docs[0].data().state === 1) {
          return db
            .collection("reactions")
            .doc(data.docs[0].id)
            .delete()
            .then(() => {
              postData.likeCount--;
              return postDocumnet.update({ likeCount: postData.likeCount });
            })
            .then(() => {
              return res.json(postData);
            });
        } else if (data.docs[0].data().state === -1) {
          return db
            .collection("reactions")
            .doc(data.docs[0].id)
            .update({ state: 1 })
            .then(() => {
              postData.likeCount++;
              postData.dislikeCount--;
              return postDocumnet.update({
                dislikeCount: postData.dislikeCount,
                likeCount: postData.likeCount,
              });
            })
            .then(() => {
              return res.json(postData);
            });
        }
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.dislikePost = (req, res) => {
  const likeDocument = db
    .collection("reactions")
    .where("userHandle", "==", req.user.handle)
    .where("postId", "==", req.params.postId)
    .limit(1);

  const postDocumnet = db.doc(`/posts/${req.params.postId}`);

  let postData;

  postDocumnet
    .get()
    .then((doc) => {
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Post not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("reactions")
          .add({
            postId: req.params.postId,
            userHandle: req.user.handle,
            state: -1, // A state of -1 represents a dislike
          })
          .then(() => {
            postData.dislikeCount++;
            return postDocumnet.update({ dislikeCount: postData.dislikeCount });
          })
          .then(() => {
            return res.json(postData);
          });
      } else {
        if (data.docs[0].data().state === -1) {
          return db
            .collection("reactions")
            .doc(data.docs[0].id)
            .delete()
            .then(() => {
              postData.dislikeCount--;
              return postDocumnet.update({
                dislikeCount: postData.dislikeCount,
              });
            })
            .then(() => {
              return res.json(postData);
            });
        } else if (data.docs[0].data().state === 1) {
          return db
            .collection("reactions")
            .doc(data.docs[0].id)
            .update({ state: -1 })
            .then(() => {
              postData.likeCount--;
              postData.dislikeCount++;
              return postDocumnet.update({
                dislikeCount: postData.dislikeCount,
                likeCount: postData.likeCount,
              });
            })
            .then(() => {
              return res.json(postData);
            });
        }
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.commentOnPost = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    postId: req.params.postId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  };
  console.log(newComment);

  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};
