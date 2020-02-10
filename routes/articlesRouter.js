const express = require("express");
const cors = require("cors");

const articlesRouter = express.Router();

// error handlers
const { handleInvalidMethod405 } = require("../errors/index.js");

// articles controllers
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getAllCommentsByArticleId,
  getAllArticles,
  deleteArticleById,
  postArticle
} = require("../controllers/articlesController.js");

//enable cors
app.use(cors());

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById)
  .all(handleInvalidMethod405);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getAllCommentsByArticleId)
  .all(handleInvalidMethod405);

articlesRouter
  .route("/")
  .get(getAllArticles)
  .post(postArticle)
  .all(handleInvalidMethod405);

module.exports = articlesRouter;
