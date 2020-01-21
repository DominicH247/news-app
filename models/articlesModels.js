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
      // format article
      const comment_count = comments.length;
      const articleFormatted = { ...articles[0], comment_count };
      delete articleFormatted.body;

      return articleFormatted;
    }
  );
};
