import express from "express";
import mongoose from "mongoose";

const Post = mongoose.model("Post");
const router = new express.Router();
import requireLogin from "../middleware/requireLogin.js";

router.get("/allpost", (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body } = req.body;
  console.log(title, body);
  if (!title || !body) {
    return res.status(422).json({ message: "please add all the fields." });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
 
router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((myPost) => {
      res.json({ myPost });
    })
    .catch((err) => {
      console.log(err);
    });
});

export default router;
