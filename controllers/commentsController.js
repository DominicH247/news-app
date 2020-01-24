const {
  updateCommentById,
  removeCommentById
} = require("../models/commentsModel.js");

exports.patchCommentById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;

  updateCommentById(comment_id, inc_votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
