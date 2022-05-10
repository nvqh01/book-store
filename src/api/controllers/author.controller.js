import ApiError from "../helpers/ApiError";
import catchAsync from "../helpers/catchAsync";
import createError from "http-errors";
import { Author, Book } from "../models/index";

// Add a author
const addAuthor = catchAsync(async (req, res, next) => {
  if (!req.body) {
    next(
      new ApiError(createError.BadRequest("Please enter full information !"))
    );
  }
  const newAuthor = new Author(req.body);
  const savedAuthor = await newAuthor.save();
  res.status(200).json({
    message: "Add an author successfully!",
    data: savedAuthor,
  });
});

// Delete an author
const deleteAuthor = catchAsync(async (req, res, next) => {
  await Book.updateMany({ author: req.params.id }, { author: null });
  await Author.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: "Delete an author successfully !",
  });
});

// Get an author
const getAuthor = catchAsync(async (req, res, next) => {
  const author = await Author.findById(req.params.id).populate("books");
  res.status(200).json({
    message: "Get an author successfully !",
    data: author,
  });
});

// Get all authors
const getAllAuthors = catchAsync(async (req, res, next) => {
  const authors = await Author.find();
  res.status(200).json({
    message: "Get all authors successfully !",
    data: authors,
  });
});

// Update an author
const updateAuthor = catchAsync(async (req, res, next) => {
  const author = await Author.findById(req.params.id);
  if (!author) {
    next(new ApiError(createError.NotFound("Author is not found !")));
  }
  if (!req.body) {
    next(
      new ApiError(createError.BadRequest("Please enter full information !"))
    );
  }
  await author.updateOne({ $set: req.body });
  res.status(200).json({
    message: "Update an author successfully!",
  });
});

module.exports = {
  addAuthor,
  deleteAuthor,
  getAuthor,
  getAllAuthors,
  updateAuthor,
};
