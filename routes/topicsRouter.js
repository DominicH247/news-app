const express = require("express");
const topicsRouter = express.Router();

const { getTopics } = require("../controllers/topicsController.js");

//topics routes
topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
