// articles model
const {
  fetchArticleById,
  updateArticleById,
  insertCommentByArticleId,
  fetchAllCommentsByArticleId,
  fetchAllArticles
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
  const { article_id } = req.params;
  const query = req.query;
  fetchAllCommentsByArticleId(article_id, query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  console.log(req.query);
  const arrayOfPromises = [];

  // topic exists but no article
  // checkTopic exists
  // fetch all articles
  if (req.query.hasOwnProperty("topic")) {
    arrayOfPromises.push(
      checkTopicExists(req.query),
      fetchAllArticles(req.query)
    );
    Promise.all(arrayOfPromises)
      .then(([topic, articles]) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  }

  // author exists but no article
  // check author
  // fetch all articles
  if (req.query.hasOwnProperty("author")) {
    arrayOfPromises.push(
      checkUsernameExists(req.query),
      fetchAllArticles(req.query)
    );
    Promise.all(arrayOfPromises)
      .then(([author, articles]) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  }

  // everything valid
  fetchAllArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
  // fetch all articles no query
  // if(req.query)

  // if (req.query.hasOwnProperty(author) && req.query.hasOwnProperty(topic)) {
  //   arrayOfPromises.push(fetchAllArticles(req.query));
  // } else if (req.query.hasOwnProperty(author) && !req.query.hasOwnProperty(topic)) {
  //   arrayOfPromises.push()
  // }

  // const checkUserPromise = checkUsernameExists(req.query);
  // const checkTopicPromise = checkTopicExists(req.query);
  // arrayOfPromises.push(checkUserPromise, checkTopicPromise);
};
