import dotenv from "dotenv";
import createError from "http-errors";
import mongoose from "mongoose";

dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Success to connect database !");
  } catch (err) {
    console.log(`Fail to connect database ! \nError: ${err.message}`);
  }
};

module.exports = { connect };
