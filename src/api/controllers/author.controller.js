const addAuthor = (req, res) => {
  res.send("Add Author");
};

const deleteAuthor = (req, res) => {
  res.send("Delete Author");
};

const getAuthor = (req, res) => {
  res.send("Get Author");
};

const getAllAuthors = (req, res) => {
  res.send("Get All Authors");
};

const updateAuthor = (req, res) => {
  res.send("Update Author");
};

module.exports = {
  addAuthor,
  deleteAuthor,
  getAuthor,
  getAllAuthors,
  updateAuthor,
};
