const userController = require("./user.controller");
const authMiddleware = require("../Auth/auth.middleware");
const userMiddleware = require("./user.middleware");
const express = require("express");

const userRouter = express.Router();

userRouter.get("/get-user/:id", userController.getUserById);
userRouter.put("/update-profile/:id", authMiddleware.validateAuth, userMiddleware.validateUser, userController.updateUser);


module.exports = userRouter;