const express = require("express");
const articlesRouter = express.Router();

// error handlers
const { handleInvalidMethod405 } = require("../errors/index.js");

// articles controllers
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getAllCommentsByArticleId,
  getAllArticles
} = require("../controllers/articlesController.js");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handleInvalidMethod405);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getAllCommentsByArticleId)
  .all(handleInvalidMethod405);

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(handleInvalidMethod405);

module.exports = articlesRouter;
