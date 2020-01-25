// models
const {
  fetchUserByUsername,
  fetchAllUsers
} = require("../models/usersModels.js");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  fetchUserByUsername(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers().then(users => {
    res.status(200).send({ users });
  });
};
