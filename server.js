// Importing the required packages and settng the app
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { mongoURL } from "./keys.js";
import "./models/userModel.js";
import "./models/post.js";
import router from "./routes/auth.js";
import post from "./routes/post.js";
mongoose.model("User");

const app = express();
const PORT = 5000;
// setting up the middlewares.

app.use(bodyParser.json());
app.use(router);
app.use(post);

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
