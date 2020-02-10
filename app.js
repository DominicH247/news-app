const express = require("express");
const cors = require("cors");
const app = express();

// routers
const apiRouter = require("./routes/apiRouter.js");

// error handlers
const {
  handleCustom,
  handleBadRequest400,
  handleInvalidPath404,
  handleServerError500,
  handleUnprocessable422
} = require("./errors/index.js");

//enable cors
app.use(cors());

//parse request body
app.use(express.json());

//api route
app.use("/api", apiRouter);

// error handlers
app.use(handleCustom);
app.use(handleUnprocessable422);
app.use(handleBadRequest400);

// controller error handlers
app.all("/*", handleInvalidPath404);
app.use(handleServerError500);
module.exports = app;
