import ApiError from "./api/helpers/ApiError";
import bodyParser from "body-parser";
import cors from "cors";
import createError from "http-errors";
import db from "./config/db.config";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import logger from "./config/logger";
import morgan from "morgan";
import redis from "./config/redis.config";
import router from "./api/routes/index";
import { errorConverter, errorHandler } from "./api/middlewares/error";

dotenv.config();

const app = express();

// Connect database
db.connect(process.env.MONGODB_URL);
redis.connect();

// Use cors
app.use(cors());

// Parse application/json
app.use(bodyParser.json("limit: 100MB"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

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

// Use dotenv
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port: http://localhost:${PORT}`);
});
