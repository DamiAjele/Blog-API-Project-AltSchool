const joi = require("joi");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const validateRegistration = (req, res, next) => {
  const registrationSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });

  const { error } = registrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });

  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

const validateAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const authToken = token.split(" ")[1];

    if (!authToken) {
        console.log(authToken);
      return res.status(401).json({ message: "User not Unauthorized" });
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return error.name === "JsonWebTokenError"
      ? res.status(401).json({ message: "Invalid token" })
      : res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateAuth,
};
