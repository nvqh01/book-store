import express from "express";

import authorRouter from "./author.route";
import bookRouter from "./book.route";

const router = express.Router();

router.use("/author", authorRouter);
router.use("/book", bookRouter);

module.exports = router;
