import express from "express";
import authorRouter from "./author.route";
import bookRouter from "./book.route";
import userRouter from "./user.route";
import { verifyAccessToken } from "../services/token.service";

const router = express.Router();

router.use("/author", verifyAccessToken, authorRouter);
router.use("/book", verifyAccessToken, bookRouter);
router.use("/user", userRouter);

module.exports = router;
