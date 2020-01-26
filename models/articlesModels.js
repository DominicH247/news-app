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
  { sort_by = "created_at", order = "desc", limit = 10 }
) => {
  if (/\d/.test(limit)) {
    return connection
      .select("comment_id", "author", "votes", "created_at", "body")
      .from("comments")
      .where({ article_id })
      .orderBy(sort_by, order)
      .limit(limit);
  } else {
    return Promise.reject(custom400);
  }
};

exports.fetchAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic,
  limit = 10
}) => {
  // TO REFACTOR TO PROMISE.ALL
  // reject if passed an invalid order or an invalid limit
  if (order === "asc" || (order === "desc" && /\d/.test(limit))) {
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
      .limit(limit)
      .modify(query => {
        if (author) {
          query.where("articles.author", author);
        }
        if (topic) {
          query.where({ topic });
        }
      })
      .then(articles => {
        // second request for all articles to get count
        return connection
          .select()
          .count("*")
          .from("articles")
          .then(articlesCount => {
            /* convert comment_count to int to allow sort_by votes 
            to work correctly and add total articles_count */
            const formattedArticles = articles.map(article => {
              const formatted = {
                ...article,
                comment_count: Number(article.comment_count),
                total_count: Number(articlesCount[0].count)
              };
              return formatted;
            });
            return formattedArticles;
          });
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

exports.removeArticleById = article_id => {
  return connection
    .from("articles")
    .where({ article_id })
    .del();
};

exports.insertArticle = newArticleData => {
  const formattedInput = {
    ...newArticleData,
    author: newArticleData.username
  };
  delete formattedInput.username;

  // defaults votes to zero on newly posted article
  if ("votes" in formattedInput) {
    delete formattedInput.votes;
  }

  return connection
    .from("articles")
    .insert(formattedInput)
    .returning("*")
    .then(insertedArticle => {
      const { article_id } = insertedArticle[0];
      return connection
        .select(
          "articles.author",
          "title",
          "articles.article_id",
          "topic",
          "articles.created_at",
          "articles.votes",
          "articles.body"
        )
        .from("articles")
        .count({ comment_count: "comment_id" })
        .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
        .groupBy("articles.article_id")
        .modify(query => {
          query.where("articles.article_id", article_id);
        });
    })
    .then(insertedArticle => {
      // convert comment count to integer
      const formattedArticle = {
        ...insertedArticle[0],
        comment_count: Number(insertedArticle[0].comment_count)
      };

      return formattedArticle;
    });
};
