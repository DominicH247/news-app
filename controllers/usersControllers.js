// models
const {
  fetchUserByUsername,
  fetchAllUsers,
  insertUser
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

exports.postUser = (req, res, next) => {
  const newUserData = req.body;

  insertUser(newUserData)
    .then(user => {
      console.log({ user });
      res.status(201).send({ user });
    })
    .catch(next);
};
