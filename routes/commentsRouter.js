const express = require("express");
const commentsRouter = express.Router();

// controllers
const {
  patchCommentById,
  deleteCommentById
} = require("../controllers/commentsController.js");

// routes
commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById);

module.exports = commentsRouter;
