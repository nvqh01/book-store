const errorHandler = (err, req, res, next) => {
  res.json({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Sever Error",
    },
  });
};

module.exports = errorHandler;
