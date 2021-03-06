// Importing the required packages and settng the app
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { mongoURL } from "./keys.js";
import "./models/userModel.js";
import "./models/post.js";
import cors from 'cors';
import router from "./routes/auth.js";
import post from "./routes/post.js";
import user from "./routes/user.js";
mongoose.model("User");

const app = express();
const PORT = 5000;
// setting up the middlewares.

app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(router);
app.use(post);
app.use(user);
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
});

mongoose.connection.on("connected", () => {
  console.log("Connected to the mongoose databse");
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});

// listening to the port.
app.listen(PORT, function () {
  console.log("Listening on port 3000");
});
