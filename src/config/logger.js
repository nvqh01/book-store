import { v4 as uuid } from "uuid";
import { createLogger, transports, format } from "winston";

const customeFormat = format.combine(
  format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
  format.printf((info) => {
    return `${
      info.timestamp
    } --- [${info.level.toUpperCase()}] --- [${uuid()}] --- [${info.message.trim()}]`;
  })
);

const logger = createLogger({
  format: customeFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: "src/logs/app.log", level: "info" }),
  ],
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(`${message}\n`);
  },
};

module.exports = logger;
