const express = require("express");
const app = express();

// routers
const apiRouter = require("./routes/apiRouter.js");

// error handlers
const {
  handleInvalidPath404,
  handleServerError500
} = require("./errors/index.js");

//parse request body
app.use(express.json());

//api route
app.use("/api", apiRouter);

// controller error handlers
app.all("/*", handleInvalidPath404);
app.use(handleServerError500);
module.exports = app;
