const express = require("express");
const apiRouter = express.Router();

const topicsRouter = require("./topicsRouter.js");

// error handler
const { handleInvalidPath404 } = require("../errors/index.js");

// api paths
apiRouter.use("/topics", topicsRouter);

// invalid paths
apiRouter.use("/*", handleInvalidPath404);

module.exports = apiRouter;
