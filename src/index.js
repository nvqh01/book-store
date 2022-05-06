import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import createError from "http-errors";
import morgan from "morgan";

import db from "./config/db.config";
import errorHandle from "./api/middlewares/errorHandle";
import router from "./api/routes/index";

const app = express();

// connect database
db.connect();

// use cors
app.use(cors());

// parse application/json
app.use(bodyParser.json("limit: 100MB"));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// use helmet
app.use(helmet());

// use morgan
app.use(morgan("common"));

// routes
app.use("/api", router);

// handle route not found
app.use((req, res, next) => {
  next(createError.NotFound("This route is not found !"));
});

// handle errors
app.use(errorHandle);

// use dotenv
dotenv.config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
