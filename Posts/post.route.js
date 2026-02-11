const postController = require('./post.controller');
const express = require('express');

const postRouter = express.Router();

postRouter.post('/add-post', postController.createPost);
postRouter.get('/get-posts', postController.getAllPosts);
postRouter.get('/get-post/:id', postController.getSinglePost);
postRouter.put('/update-post/:id', postController.updatePost);
postRouter.delete('/delete-post/:id', postController.deletePost);
postRouter.put('/publish-post/:id', postController.updateStateToPublished);

module.exports = postRouter;