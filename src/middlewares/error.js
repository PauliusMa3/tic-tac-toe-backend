const logger = require("loglevel");
function errorMiddleware(error, req, res, next) {
    logger.error(error);
    res.status(error.statusCode || 500);
    res.json({
      message: error.message,
      ...(process.env.NODE_ENV === "production"
        ? null
        : {
            stack: error.stack
          })
    });
  }


  module.exports = errorMiddleware