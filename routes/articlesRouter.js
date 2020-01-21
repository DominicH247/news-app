const express = require("express");
const articlesRouter = express.Router();

// articles controllers
const { getArticleById } = require("../controllers/articlesController.js");

articlesRouter.route("/:article_id").get(getArticleById);
module.exports = articlesRouter;
