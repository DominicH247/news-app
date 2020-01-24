const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      const topicsInsertions = knex("topics").insert(topicData);

      return topicsInsertions;
    })
    .then(() => {
      const usersInsertions = knex("users").insert(userData);

      return usersInsertions;
    })
    .then(() => {
      //format article date to JS date object
      const formattedArticles = formatDates(articleData);

      // seed formatted article data into database
      return knex
        .insert(formattedArticles)
        .into("articles")
        .returning("*");
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows);

      const formattedComments = formatComments(commentData, articleRef);

      return knex("comments")
        .insert(formattedComments)
        .returning("*");
    });
};
