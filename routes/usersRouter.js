const express = require("express");
const usersRouter = express.Router();

//error handlers
const { handleInvalidMethod405 } = require("../errors/index.js");

// controllers
const {
  getUserByUsername,
  getAllUsers
} = require("../controllers/usersControllers.js");

usersRouter
  .route("/")
  .get(getAllUsers)
  .all(handleInvalidMethod405);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handleInvalidMethod405);

module.exports = usersRouter;
