const connection = require("../db/connection.js");

const { custom404, custom400 } = require("../errors/customErrors.js");

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
        return Promise.reject(custom404);
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
  const formattedComment = {
    article_id,
    author: comment.username,
    body: comment.body,
    votes: 0
  };

  return connection
    .from("comments")
    .where({ article_id })
    .insert(formattedComment)
    .returning("*")
    .then(comment => {
      console.log(comment, "model");
      return comment[0];
    });
};

exports.fetchAllCommentsByArticleId = (
  // to refactor out map and just use select
  article_id,
  { sort_by = "created_at", order = "asc" }
) => {
  return connection
    .select("comment_id", "author", "votes", "created_at", "body")
    .from("comments")
    .where({ article_id })
    .orderBy(sort_by, order)
    .then(comments => {
      console.log(comments);
      if (comments.length === 0) {
        return Promise.reject(custom404);
      }
      return comments;
    });
};

exports.fetchAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
  console.log(order);
  // reject id not passed in a valid order
  if (order === "asc" || order === "desc") {
    return connection
      .select(
        "articles.author",
        "title",
        "articles.article_id",
        "topic",
        "articles.created_at",
        "articles.votes"
      )
      .from("articles")
      .count({ comment_count: "comment_id" })
      .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order)
      .modify(query => {
        if (author) {
          query.where("articles.author", author);
        }
        if (topic) {
          query.where({ topic });
        }
      })
      .then(articles => {
        if (articles.length === 0) {
          return Promise.reject(custom404);
        }
        return articles;
      });
  } else {
    return Promise.reject(custom400);
  }
};
