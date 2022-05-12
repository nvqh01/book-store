import ApiError from "../helpers/ApiError";
import catchAsync from "../helpers/catchAsync";
import createError from "http-errors";
import { Author, Book } from "../models";

// Add a book
const addBook = catchAsync(async (req, res, next) => {
  if (!req.body) {
    next(
      new ApiError(createError.BadRequest("Please enter full information !"))
    );
  }
  const newBook = new Book(req.body);
  const savedBook = await newBook.save();
  if (req.body.author) {
    const author = Author.findById(req.body.author);
    await author.updateOne({ $push: { books: savedBook.id } });
  }
  res.status(200).json({
    message: "Add a book successfully !",
    data: savedBook,
  });
});

// Delete a book
const deleteBook = catchAsync(async (req, res, next) => {
  await Author.updateMany(
    { books: req.params.id },
    { $pull: { books: req.params.id } }
  );
  await Book.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: "Delete a book successfully !",
  });
});

// Get a book
const getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate("author");
  res.status(200).json({
    message: "Success to get a book !",
    data: book,
  });
});

// Get all books
const getAllBooks = catchAsync(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json({
    message: "Success to get all books !",
    data: books,
  });
});

// Update a book
const updateBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    next(new ApiError(createError.NotFound("Book is not found !")));
  }
  if (!req.body) {
    next(
      new ApiError(createError.BadRequest("Please enter full information !"))
    );
  }
  await book.updateOne({ $set: req.body });
  res.status(200).json({
    message: "Success to update a book !",
  });
});

module.exports = {
  addBook,
  deleteBook,
  getBook,
  getAllBooks,
  updateBook,
};

Object.prototype.hasOwnProperty.call;
