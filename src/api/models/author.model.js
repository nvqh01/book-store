import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
