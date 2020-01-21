const express = require("express");
const articlesRouter = express.Router();

// articles controllers
const {
  getArticleById,
  patchArticleById
} = require("../controllers/articlesController.js");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);
module.exports = articlesRouter;
