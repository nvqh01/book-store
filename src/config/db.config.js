import mongoose from "mongoose";

const connect = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Success to connect database !");
  } catch (err) {
    console.log(`Fail to connect database ! \nError: ${err.message}`);
  }
};

module.exports = { connect };
