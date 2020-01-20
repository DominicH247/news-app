// et environment variable
const ENV = process.env.NODE_ENV || "development";

// import data based on env
const devData = require("./development-data/index.js");
const testData = require("./test-data/index.js");

const data = {
  development: devData,
  test: testData
};

module.exports = data[ENV];
