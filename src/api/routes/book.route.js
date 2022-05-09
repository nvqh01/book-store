import express from "express";

import { bookController } from "../controllers/index";
import token from "../services/token.service";

const router = express.Router();

router
  .route("/")
  .post(bookController.addBook)
  .get(token.verifyToken, bookController.getAllBooks);

router
  .route("/:id")
  .delete(bookController.deleteBook)
  .get(bookController.getBook)
  .put(bookController.updateBook);

module.exports = router;
