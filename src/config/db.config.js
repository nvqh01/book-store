import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const conn = mongoose
  .connect(`${process.env.MONGODB_URL}`)
  .then(() => {
    console.log("Success to connect database !");
  })
  .catch(() => {
    console.log("Fail to connect database !");
  });

mongoose.connection.on("connected", () => {
  console.log("Server is connecting database !");
});

mongoose.connection.on("error", (err) => {
  console.log(`Error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Server disconnected database !");
});

process.on("SIGNINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = { conn };
