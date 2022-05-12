import express from "express";
import { bookController } from "../controllers";

const router = express.Router();

router.route("/").post(bookController.addBook).get(bookController.getAllBooks);

router
  .route("/:id")
  .delete(bookController.deleteBook)
  .get(bookController.getBook)
  .put(bookController.updateBook);

module.exports = router;
