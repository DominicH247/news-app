const express = require("express");
const apiRouter = express.Router();

// routers
const topicsRouter = require("./topicsRouter.js");
const usersRouter = require("./usersRouter.js");

// error handler
const { handleInvalidPath404 } = require("../errors/index.js");

// api paths
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

// invalid paths
apiRouter.use("/*", handleInvalidPath404);

module.exports = apiRouter;
