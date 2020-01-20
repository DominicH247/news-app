const express = require("express");
const topicsRouter = express.Router();

// controllers
const { getTopics } = require("../controllers/topicsController.js");

// error handlers
const { handleInvalidMethod405 } = require("../errors/index.js");

//topics routes
topicsRouter
  .route("/")
  .get(getTopics)
  .all(handleInvalidMethod405);

module.exports = topicsRouter;
