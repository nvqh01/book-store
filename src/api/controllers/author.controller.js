import createError from "http-errors";
import { Author, Book } from "../models/index";

const authorController = {
  addAuthor: async (req, res, next) => {
    try {
      const newAuthor = new Author(req.body);
      const savedAuthor = await newAuthor.save();
      res.status(200).json({
        message: "Success to add an author !",
        data: savedAuthor,
      });
    } catch {
      next(createError.InternalServerError("Fail to add an author !"));
    }
  },

  deleteAuthor: async (req, res, next) => {
    try {
      await Book.updateMany({ author: req.params.id }, { author: null });
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "Success to delete an author !",
      });
    } catch {
      next(createError.InternalServerError("Fail to delete an author !"));
    }
  },

  getAuthor: async (req, res, next) => {
    try {
      const author = await Author.findById(req.params.id).populate("books");
      res.status(200).json({
        message: "Success to get an author !",
        data: author,
      });
    } catch {
      next(createError.InternalServerError("Fail to get an author !"));
    }
  },

  getAllAuthors: async (req, res, next) => {
    try {
      const authors = await Author.find();
      res.status(200).json({
        message: "Success to get all authors !",
        data: authors,
      });
    } catch {
      next(createError.InternalServerError("Fail to get all authors !"));
    }
  },

  updateAuthor: async (req, res, next) => {
    try {
      const author = await Author.findById(req.params.id);
      await author.updateOne({ $set: req.body });
      res.status(200).json({
        message: "Success to update an author !",
      });
    } catch {
      next(createError.InternalServerError("Fail to update an author !"));
    }
  },
};

module.exports = authorController;
