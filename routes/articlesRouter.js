const express = require("express");
const articlesRouter = express.Router();

// error handlers
const { handleInvalidMethod405 } = require("../errors/index.js");

// articles controllers
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId
} = require("../controllers/articlesController.js");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handleInvalidMethod405);

articlesRouter.route("/:article_id/comments").post(postCommentByArticleId);

module.exports = articlesRouter;
