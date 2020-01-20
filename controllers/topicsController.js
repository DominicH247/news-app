const { fecthAllTopics } = require("../models/topicsModels.js");

exports.getTopics = (req, res, next) => {
  fecthAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
