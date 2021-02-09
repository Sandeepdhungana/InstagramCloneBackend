import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../keys.js";
import requireLogin from "../middleware/requireLogin.js";

const User = mongoose.model("User");

const router = new express.Router();

router.post("/signup", (req, res) => {
  const { name, email, password, username } = req.body;
  if (!email || !password || !name) {
    console.log("error occured");
    return res.status(422).json({ error: "please add all the fields" });
  }
  // res.json({message:"succesfully posted"})
  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        return res.json({ error: "User already exists with that email." });
      }
      bcrypt
        .hash(password, 12)
        .then((hash) => {
          const user = new User({
            name,
            email,
            username,
            password: hash,
          });
          user
            .save()
            .then((result) => {
              res.json({ message: "Account created successfully." });
            })
            .catch((error) => {
              res.json({ message: "Error in creating account.", error });
            });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((err) => {
      console.log(error);
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  User.findOne({ email }).then((user) => {
    if (!user) {
      res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt
      .compare(password, user.password)
      .then((isMatched) => {
        if (isMatched) {
          //   res.json({ message: "successfully signed in" });
          const token = jwt.sign({ _id: user._id }, JWT_SECRET);
          const { _id, name, email, username } = user;
          res.json({ token, user: { _id, name, email, username } });
        } else {
          res.status(422).json({ error: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.get('/allusers',requireLogin, (req, res) => {
  const id = req.user._id
  User.find({_id:{$ne:id}}, (err, alluser) => {
    if(err) {
      console.log("error occured");
      console.log(err);
    } else {
      // console.log(alluser);
      res.json({alluser})
    }
  })
})

export default router;
