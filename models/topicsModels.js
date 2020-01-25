const connection = require("../db/connection.js");

// errors
const { custom404Topic } = require("../errors/customErrors.js");

exports.fetchAllTopics = () => {
  return connection.select("*").from("topics");
};

exports.checkTopicExists = ({ topic }) => {
  return connection
    .from("topics")
    .where({ slug: topic })
    .then(topic => {
      if (topic.length === 0) {
        return Promise.reject(custom404Topic);
      }
      return topic;
    });
};
