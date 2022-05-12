import express from "express";
import { authorController } from "../controllers";

const router = express.Router();

router
  .route("/")
  .post(authorController.addAuthor)
  .get(authorController.getAllAuthors);

router
  .route("/:id")
  .delete(authorController.deleteAuthor)
  .get(authorController.getAuthor)
  .put(authorController.updateAuthor);

module.exports = router;
