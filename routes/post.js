import express from "express";
import mongoose from "mongoose";

const Post = mongoose.model("Post");
const router = new express.Router();
import requireLogin from "../middleware/requireLogin.js";

router.get("/allpost", (req, res) => {
  Post.find()
    .sort({ timestamp: -1 })
    .populate("postedBy", "_id name")
    .populate([
      { path: "comments", populate: { path: "postedBy", select: "name" } },
    ])
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, picUrl } = req.body;
  if (!title || !body || !picUrl) {
    return res.status(422).json({ message: "please add all the fields." });
  }

  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: picUrl,
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
    .populate("postedBy", "_id name username following followers")
    .then((myPost) => {
      res.json({ myPost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body._id,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json({ result });
    }
  });
});
router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body._id,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json({ result });
    }
  });
});
router.put("/comments", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body._id,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json({ result });
    }
  });
});

router.delete("/delete/:_id", requireLogin, (req, res) => {
  if(req.user._id === req.params._id) {
    Post.findByIdAndDelete({ _id: req.params._id })
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      console.log(err);
    });
  } else {
    console.log("cannot delete");
  }
});

export default router;
