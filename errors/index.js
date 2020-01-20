//controller error handlers
exports.handleInvalidPath404 = (req, res, next) => {
  res.status(404).send({ msg: "404 Not Found - Invalid Path" });
};

exports.handleInvalidMethod405 = (req, res, next) => {
  res.status(405).send({ msg: "405 - Method Not Allowed" });
};

exports.handleServerError500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
