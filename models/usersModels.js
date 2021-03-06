const connection = require("../db/connection.js");
const { custom404, custom404User } = require("../errors/customErrors.js");

exports.fetchUserByUsername = username => {
  return connection
    .from("users")
    .where({ username })
    .then(user => {
      if (user.length === 0) {
        // if user array === 0 reject with custom 404
        return Promise.reject(custom404);
      }
      return user[0];
    });
};

exports.fetchAllUsers = () => {
  return connection.from("users");
};

exports.checkUsernameExists = ({ author }) => {
  return connection
    .from("users")
    .where({ username: author })
    .then(user => {
      if (user.length === 0) {
        return Promise.reject(custom404User);
      }
      return user;
    });
};

exports.insertUser = newUserData => {
  return connection
    .from("users")
    .insert(newUserData)
    .returning("*")
    .then(insertedUser => {
      return insertedUser[0];
    });
};
