const connection = require("../db/connection.js");

const { custom404Article, custom400 } = require("../errors/customErrors.js");

exports.fetchArticleById = article_id => {
  return connection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "articles.body",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(query => {
      if (article_id) {
        query.where("articles.article_id", article_id);
      }
    })
    .then(article => {
      if (article.length === 0) {
        return Promise.reject(custom404Article);
      }
      return article[0];
    });
};

exports.updateArticleById = (article_id, inc_votes = 0) => {
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
      return article[0];
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
      return comment[0];
    });
};

exports.fetchAllCommentsByArticleId = (
  article_id,
  { sort_by = "created_at", order = "desc" }
) => {
  return connection
    .select("comment_id", "author", "votes", "created_at", "body")
    .from("comments")
    .where({ article_id })
    .orderBy(sort_by, order);
};

exports.fetchAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
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
        // convert comment_count to int to allow sort_by votes to work correctly
        const formattedArticles = articles.map(article => {
          const formatted = {
            ...article,
            comment_count: Number(article.comment_count)
          };
          return formatted;
        });
        return formattedArticles;
      });
  } else {
    return Promise.reject(custom400);
  }
};

exports.checkArticleExists = article_id => {
  return connection
    .from("articles")
    .where({ article_id })
    .then(article => {
      if (article.length === 0) {
        return Promise.reject(custom404Article);
      }
    });
};
