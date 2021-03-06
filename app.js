const express = require("express");
const app = express();
const cors = require("cors");

//enable cors
app.use(cors());

// set json indentation
app.set("json spaces", 4);

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
