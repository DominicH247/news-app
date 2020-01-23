const express = require("express");
const commentsRouter = express.Router();

// error handlers
const { handleInvalidMethod405 } = require("../errors/index.js");

// controllers
const {
  patchCommentById,
  deleteCommentById
} = require("../controllers/commentsController.js");

// routes
commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(handleInvalidMethod405);

module.exports = commentsRouter;
