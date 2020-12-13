const HTTP_SERVER_ERROR = 500;
module.exports.errorHandler = (error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(HTTP_SERVER_ERROR);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🍰' : error.stack,
  });
};