const connection = require("../db/connection.js");
const { custom404 } = require("../errors/customErrors.js");

exports.fetchUserByUsername = username => {
  return connection
    .from("users")
    .where({ username })
    .then(user => {
      if (user.length === 0) {
        // if user array === 0 reject with custom 404
        return Promise.reject(custom404);
      }
      return user;
    });
};
