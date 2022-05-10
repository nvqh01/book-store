import ApiError from "../helpers/ApiError";
import createError from "http-errors";
import mongoose from "mongoose";

// Convert errors except ApiError
const errorConverter = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    const error =
      err instanceof mongoose.Error
        ? createError.BadRequest(err.message)
        : createError.InternalServerError(err.message);
    err = new ApiError(error, false, error.stack);
  }
  next(err);
};

// Return errors to client in JSON
const errorHandler = (err, req, res, next) => {
  const { statusCode, message, stack } = err;
  res.json({
    error: {
      statusCode,
      message,
      stack,
    },
  });
};

module.exports = {
  errorConverter,
  errorHandler,
};
