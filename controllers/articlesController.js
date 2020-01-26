// articles model
const {
  fetchArticleById,
  updateArticleById,
  insertCommentByArticleId,
  fetchAllCommentsByArticleId,
  fetchAllArticles,
  checkArticleExists,
  removeArticleById,
  insertArticle
} = require("../models/articlesModels.js");

//users model
const { checkUsernameExists } = require("../models/usersModels.js");

// topics model
const { checkTopicExists } = require("../models/topicsModels.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleById(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  insertCommentByArticleId(article_id, comment)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getAllCommentsByArticleId = (req, res, next) => {
  // check article exists
  const { article_id } = req.params;
  const query = req.query;
  const arrayOfPromises = [
    checkArticleExists(article_id),
    fetchAllCommentsByArticleId(article_id, query)
  ];

  Promise.all(arrayOfPromises)
    .then(([aritcle, comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const arrayOfPromises = [fetchAllArticles(req.query)];

  // topic exists but no article
  // checkTopic exists
  // fetch all articles
  if (req.query.hasOwnProperty("topic")) {
    arrayOfPromises.push(checkTopicExists(req.query));
  }

  // author exists but no article
  // check author
  // fetch all articles
  if (req.query.hasOwnProperty("author")) {
    arrayOfPromises.push(checkUsernameExists(req.query));
  }

  // everything valid
  Promise.all(arrayOfPromises)
    .then(([articles]) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  checkArticleExists(article_id)
    .then(() => {
      return removeArticleById(article_id);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const newArticleData = req.body;

  insertArticle(newArticleData)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};
