import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../keys.js";
import requireLogin from "../middleware/requireLogin.js";
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const router = new express.Router();

router.get("/profile/:userid", requireLogin, (req, res) => {
  User.find({ _id: req.params.userid })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.userid })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error });
          }
          res.json({ user, posts });
        });
    });
});

router.get("/myinfo", requireLogin, (req, res) => {
  User.find({ _id: req.user._id })
    .select("-password -email")
    .then((user) => {
      res.json({ user });
    });
});

export default router;
