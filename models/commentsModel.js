const connection = require("../db/connection.js");
const { custom404, custom400 } = require("../errors/customErrors.js");

exports.updateCommentById = (comment_id, inc_votes = 0) => {
  return connection
    .from("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(comment => {
      console.log(comment);
      if (comment.length === 0) {
        return Promise.reject(custom400);
      }
      return comment[0];
    });
};
