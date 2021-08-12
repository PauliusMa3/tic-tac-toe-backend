const httpStatus = require("http-status");

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { body } = req;

    const validationOptions = {
      abortEarly: false,
      allowUnknown: true
    };

    const { error } = schema.validate(body, validationOptions);

    if (error) {
      const { details } = error;
      const validationErrorMessages = details
        .map((detail) => detail.message)
        .join(",");

      return res.status(httpStatus.BAD_REQUEST).json({
        error: validationErrorMessages
      });
    }

    return next();
  };
};

module.exports = validationMiddleware;
