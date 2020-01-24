const available_routes = require("../endpoints.json");

exports.getAllRoutes = (req, res, next) => {
  res.status(200).json({ available_routes });
};
