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
