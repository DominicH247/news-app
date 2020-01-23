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
      return user;
    });
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
