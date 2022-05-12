import app from "./app";
import db from "./config/db.config";
import dotenv from "dotenv";
import logger from "./config/logger";
import redis from "./config/redis.config";

dotenv.config();

// Connect database
db.connect(process.env.MONGODB_URL);
redis.connect();

// Create port
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port: http://localhost:${PORT}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
