const { updateCommentById } = require("../models/commentsModel.js");

exports.patchCommentById = (req, res, next) => {
  updateCommentById().then();
};
