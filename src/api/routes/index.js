import express from "express";

import authorRouter from "./author.route";
import bookRouter from "./book.route";
import userRouter from "./user.route";

const router = express.Router();

router.use("/author", authorRouter);
router.use("/book", bookRouter);
router.use("/user", userRouter);

module.exports = router;
