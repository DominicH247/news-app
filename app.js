const express = require("express");
const app = express();

const apiRouter = require("./routes/apiRouter.js");

//parse request body
app.use(express.json());

//api route
app.use("/api", apiRouter);

module.exports = app;
