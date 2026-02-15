const express = require("express");
const errorHandler = require("./Middleware/errorHandler");
const postRouter = require("./Posts/post.route");
const authRouter = require("./Auth/auth.route");
const userRouter = require("./Users/user.route");
require("dotenv").config();

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/v1/posts", postRouter);
app.use("/v1/auth", authRouter);
app.use("/v1/users", userRouter);

app.use(errorHandler);

module.exports = app;