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
      /* 
          
          Your article data is currently in the incorrect format and will violate your SQL schema. 
          
          You will need to write and test the provided formatDate utility function to be able insert your article data.
    
          Your comment insertions will depend on information from the seeded articles, so make sure to return the data after it's been seeded.
          */

      //format article date to JS date object
      const formattedArticles = formatDates(articleData);

      // seed formatted article data into database
      return knex
        .insert(formattedArticles)
        .into("articles")
        .returning("*");
    })
    .then(articleRows => {
      // console.log(`Inserted articles ${articleRows.length}`);

      //format comments - exchange "blongs_to" to "article_id"

      // comments format
      // comment_id
      // author
      // article_id
      // votes
      // created_at
      // body

      /* 
    
          Your comment data is currently in the incorrect format and will violate your SQL schema. 
    
          Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 
          
          You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
          */

      const articleRef = makeRefObj(articleRows);

      const formattedComments = formatComments(commentData, articleRef);

      return knex("comments")
        .insert(formattedComments)
        .returning("*");
    })
    .then(insertedComments => {
      // console.log(`Inserted comments: ${insertedComments.length}`);
    });
};
