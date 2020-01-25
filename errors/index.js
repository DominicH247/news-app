exports.handleCustom = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleUnprocessable422 = (err, req, res, next) => {
  const unprocessableCodes = ["23503"];
  if (unprocessableCodes.includes(err.code)) {
    res.status(422).send({ msg: "422 Unprocessable Entity" });
  } else {
    next(err);
  }
};

exports.handleBadRequest400 = (err, req, res, next) => {
  const badRequestCodes = ["22P02", "23502", "42703", "23505"];

  if (badRequestCodes.includes(err.code)) {
    if (err.code === "23505") {
      res.status(400).send({ msg: "400 Bad Request - already exists" });
    } else {
      res.status(400).send({ msg: "400 Bad Request" });
    }
  } else {
    next(err);
  }
};

exports.handleServerError500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

//controller error handlers
exports.handleInvalidPath404 = (req, res, next) => {
  res.status(404).send({ msg: "404 Not Found - Invalid Path" });
};

exports.handleInvalidMethod405 = (req, res, next) => {
  res.status(405).send({ msg: "405 - Method Not Allowed" });
};
