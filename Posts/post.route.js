const postController = require("./post.controller");
const postMiddleware = require("./post.middleware");
const authMiddleware = require("../Auth/auth.middleware");
const express = require("express");

const postRouter = express.Router();

postRouter.post(
  "/add-post",
  authMiddleware.validateAuth,
  postMiddleware.validatePost,
  postController.createPost,
);
postRouter.get(
  "/get-posts-by-loggedin-users",
  authMiddleware.validateAuth,
  postController.getAllPosts,
);
postRouter.get("/get-posts-by-notloggedin-users", postController.getAllPosts);
postRouter.get(
  "/get-post/:id",
  authMiddleware.validateAuth,
  postController.getSinglePost,
);
postRouter.put(
  "/update-post/:id",
  authMiddleware.validateAuth,
  postMiddleware.validatePost,
  postController.updatePost,
);
postRouter.delete(
  "/delete-post/:id",
  authMiddleware.validateAuth,
  postController.deletePost,
);
postRouter.put(
  "/publish-post/:id",
  authMiddleware.validateAuth,
  postController.updateStateToPublished,
);

module.exports = postRouter;
