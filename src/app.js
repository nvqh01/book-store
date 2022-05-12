import ApiError from "./api/helpers/ApiError";
import cors from "cors";
import createError from "http-errors";
import express from "express";
import helmet from "helmet";
import logger from "./config/logger";
import morgan from "morgan";
import router from "./api/routes";
import { errorConverter, errorHandler } from "./api/middlewares/error";

const app = express();

// Use cors
app.use(cors());

// Parse application/json
app.use(express.json("limit: 10MB"));

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Use helmet
app.use(helmet());

// Use morgan
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: logger.stream,
  })
);

// Routes
app.use("/api", router);

// Handle route not found
app.use((req, res, next) => {
  next(new ApiError(createError.NotFound("This route is not found !")));
});

// Convert errors
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

module.exports = app;
