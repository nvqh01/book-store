import { createClient } from "redis";

const redis = createClient({
  port: 6379,
  host: "127.0.0.1",
});

redis.on("connect", (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log("Success to connect redis !");
});

module.exports = redis;
