const connection = require("../db/connection.js");

exports.fecthAllTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .then(topics => {
      return topics;
    });
};
