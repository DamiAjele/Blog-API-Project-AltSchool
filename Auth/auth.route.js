const express = require("express");
const authController = require("./auth.controller");
const authMiddleware = require("./auth.middleware");

const authRouter = express.Router();

authRouter.post("/register", authMiddleware.validateRegistration, authController.register);
authRouter.post("/login", authMiddleware.validateLogin, authController.login);

module.exports = authRouter;