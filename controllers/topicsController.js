const { fetchAllTopics, insertTopic } = require("../models/topicsModels.js");

exports.getTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const newTopicData = req.body;
  insertTopic(newTopicData)
    .then(topic => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
