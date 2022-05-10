import express from "express";
import { authorController } from "../controllers/index";
import { verifyAccessToken } from "../services/token.service";

const router = express.Router();

router
  .route(verifyAccessToken, "/")
  .post(authorController.addAuthor)
  .get(authorController.getAllAuthors);

router
  .route(verifyAccessToken, "/:id")
  .delete(authorController.deleteAuthor)
  .get(authorController.getAuthor)
  .put(authorController.updateAuthor);

module.exports = router;
