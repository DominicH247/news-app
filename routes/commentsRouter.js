const express = require("express");
const commentsRouter = express.Router();

// controllers
const { patchCommentById } = require("../controllers/commentsController.js");

// routes
commentsRouter.route("/:comments_id").patch(patchCommentById);

module.exports = commentsRouter;
