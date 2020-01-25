const { fetchAllTopics } = require("../models/topicsModels.js");

exports.getTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
