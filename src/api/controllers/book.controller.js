const addBook = (req, res) => {
  res.send("Add Book");
};

const deleteBook = (req, res) => {
  res.send("Delete Book");
};

const getBook = (req, res) => {
  res.send("Get Book");
};

const getAllBooks = (req, res) => {
  res.send("Get All Books");
};

const updateBook = (req, res) => {
  res.send("Update Book");
};

module.exports = {
  addBook,
  deleteBook,
  getBook,
  getAllBooks,
  updateBook,
};
