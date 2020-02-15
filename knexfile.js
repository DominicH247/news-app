const { DB_URL } = process.env;
const userConfig = require("./configuration.js");

const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      user: userConfig.user,
      password: userConfig.password
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      user: userConfig.user,
      password: userConfig.password
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
