const express = require("express");
const cors = require("cors");
const apiRouter = express.Router();

//enable cors
app.use(cors());

// routers
const topicsRouter = require("./topicsRouter.js");
const usersRouter = require("./usersRouter.js");
const articlesRouter = require("./articlesRouter.js");
const commentsRouter = require("./commentsRouter.js");

//controllers
const { getAllRoutes } = require("../controllers/apiController.js");

// error handler
const {
  handleInvalidPath404,
  handleInvalidMethod405
} = require("../errors/index.js");

// api paths
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

// api home route
apiRouter
  .route("/")
  .get(getAllRoutes)
  .all(handleInvalidMethod405);

// invalid paths - overkill...
apiRouter.use("/*", handleInvalidPath404);

module.exports = apiRouter;
