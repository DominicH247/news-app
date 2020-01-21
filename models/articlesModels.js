const connection = require("../db/connection.js");

exports.fetchArticleById = article_id => {
  // commments
  const commentsPromise = connection
    .from("comments")
    .where({ article_id })
    .then(comment => {
      return comment;
    });

  // articles
  const articlePromise = connection
    .from("articles")
    .where({ article_id })
    .then(article => {
      return article;
    });

  return Promise.all([articlePromise, commentsPromise]).then(
    ([articles, comments]) => {
      //if articles or comments array is 0 reject with custom 404
      if (articles.length === 0 || comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404 Not Found - Item does not exist"
        });
      }

      // format article
      const comment_count = comments.length;
      const articleFormatted = { ...articles[0], comment_count };
      delete articleFormatted.body;

      return articleFormatted;
    }
  );
};

exports.updateArticleById = (article_id, inc_votes) => {
  // update article votes
  return connection
    .from("articles")
    .where({ article_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404 Not Found - Item does not exist"
        });
      }
      return article;
    });
};

exports.insertCommentByArticleId = (article_id, comment) => {
  /* Check user and article exists will */
  const checkUserPromise = connection
    .from("users")
    .where({ username: comment.username })
    .then(user => {
      return user;
    });

  const checkArticlePromise = connection
    .from("articles")
    .where({ article_id })
    .then(article => {
      return article;
    });

  return Promise.all([checkUserPromise, checkArticlePromise]).then(
    ([checkedUser, checkArticle]) => {
      // format comment for db insertion
      const formattedComment = {
        author: checkedUser[0].username,
        article_id: Number(article_id),
        votes: 0,
        body: comment.body
      };

      // insert formatted comment into comments table
      return connection
        .from("comments")
        .insert(formattedComment)
        .returning("*")
        .then(insertedComment => {
          return insertedComment[0];
        });
    }
  );
};