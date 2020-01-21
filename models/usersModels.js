const connection = require("../db/connection.js");

exports.fetchUserByUsername = username => {
  return connection
    .from("users")
    .where({ username })
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404 Not Found - Item does not exist"
        });
      }
      return user;
    });
};
