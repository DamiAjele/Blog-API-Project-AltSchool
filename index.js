const express = require("express");
const cookieParser = require("cookie-parser");
const errorHandler = require("./Middleware/errorHandler");
const postRouter = require("./Posts/post.route");
const connectDB = require("./Config/db");
require("dotenv").config();

const app = express();
const PORT = 8000;

//Middleware
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/v1/posts", postRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
