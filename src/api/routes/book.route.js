import express from "express";
import { bookController } from "../controllers/index";
import { verifyAccessToken } from "../services/token.service";

const router = express.Router();

router
  .route(verifyAccessToken, "/")
  .post(bookController.addBook)
  .get(bookController.getAllBooks);

router
  .route(verifyAccessToken, "/:id")
  .delete(bookController.deleteBook)
  .get(bookController.getBook)
  .put(bookController.updateBook);

module.exports = router;
