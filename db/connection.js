const knex = require("knex");
const dbConfig = require("../knexfile.js");

// create connection to database;
const connection = knex(dbConfig);

module.exports = connection;
