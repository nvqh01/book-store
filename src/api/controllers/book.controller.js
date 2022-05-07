import createError from "http-errors";
import { Author, Book } from "../models/index";

const bookController = {
  addBook: async (req, res, next) => {
    try {
      const newBook = new Book(req.body);
      const savedBook = await newBook.save();
      if (req.body.author) {
        const author = Author.findById(req.body.author);
        await author.updateOne({ $push: { books: savedBook.id } });
      }
      res.status(200).json({
        message: "Success to add a book !",
        data: savedBook,
      });
    } catch {
      next(createError.InternalServerError("Fail to add a book !"));
    }
  },

  deleteBook: async (req, res, next) => {
    try {
      await Author.updateMany(
        { books: req.params.id },
        { $pull: { books: req.params.id } }
      );
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "Success to delete a book !",
      });
    } catch {
      next(createError.InternalServerError("Fail to delete a book !"));
    }
  },

  getBook: async (req, res, next) => {
    try {
      const book = await Book.findById(req.params.id).populate("author");
      res.status(200).json({
        message: "Success to get a book !",
        data: book,
      });
    } catch {
      next(createError.InternalServerError("Fail to get a book !"));
    }
  },

  getAllBooks: async (req, res, next) => {
    try {
      const books = await Book.find();
      res.status(200).json({
        message: "Success to get all books !",
        data: books,
      });
    } catch {
      next(createError.InternalServerError("Fail to get all books !"));
    }
  },

  updateBook: async (req, res, next) => {
    try {
      const book = await Book.findById(req.params.id);
      await book.updateOne({ $set: req.body });
      res.status(200).json({
        message: "Success to update a book !",
      });
    } catch {
      next(createError.InternalServerError("Fail to update a book !"));
    }
  },
};

module.exports = bookController;
