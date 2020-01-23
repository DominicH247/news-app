exports.getAllRoutes = (req, res, next) => {
  const available_routes = [
    "GET - /api",
    "GET - /api/topics",
    "GET - /api/users/:username",
    "GET - /api/articles",
    "GET - /api/articles/:article_id",
    "PATCH - /api/articles/:article_id",
    "POST - /api/articles/article_id/comments",
    "GET - /api/articles/article_id/comments",
    "PATCH - /api/comments/:comment_id",
    "DELETE - /api/comments/:comment_id"
  ];

  res.status(200).json({ available_routes });
};
