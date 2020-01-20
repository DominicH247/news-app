exports.handleInvalidPath404 = (req, res, next) => {
  res.status(404).send({ msg: "404 Not Found - Invalid Path" });
};

exports.handleInvalidMethod405 = (req, res, next) => {
  res.status(405).send({ msg: "405 - Method Not Allowed" });
};
