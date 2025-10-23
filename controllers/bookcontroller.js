import axios from "axios";
import bodyParser from "body-parser";
import {
  getAllBooks,
  addBook,
  getBookById,
  updateBook,
  deleteBook,
} from "../models/bookmodel";
app.use(bodyParser.urlencoded({ extended: true }));

export const renderHomePage = async (req, res) => {
  //app.get("/", async (req, res) => {
  try {
    /***const result = await db.query("SELECT * FROM books");
    const editId = req.query.edit || null;
    res.render("index.ejs", { Book: result.rows, editId });
    ***/
    const result = await getAllBooks();
    const editId = req.query.edit || null;
    res.render("index.ejs", { Book: result, editId });
  } catch (error) {
    res.status(500).send("some thing went wrong");
  }
};

export const addBookForm = async (req, res) => {
  res.render("add.ejs");
};

export const handleNewBook = async (req, res) => {
  try {
    const apiURL = `https://openlibrary.org/search.json?title=${encodeURIComponent(
      req.body.title
    )}&author=${encodeURIComponent(req.body.author)}`;

    const response = await axios.get(apiURL);

    let coverId = null;
    if (response.data.docs.length > 0 && response.data.docs[0].cover_i) {
      coverId = response.data.docs[0].cover_i;
    }

    /***await db.query(
      "INSERT INTO books (title, author, notes, rating, date_read, cover_id) VALUES($1, $2, $3, $4, $5, $6)",
      [
        req.body.title,
        req.body.author,
        req.body.notes,
        req.body.rating,
        req.body.date_read,
        coverId
      ]
    );
    ***/
    await addBook(req.body, coverId);
    res.redirect("/");
  } catch (error) {
    console.error("Error adding book:", error); // <== Add this line
    res.status(500).send("Failed to add book.");
  }
};

export const editBookForm = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await getBookById(id);
    res.render("edit.ejs", { book: result });
  } catch (error) {
    res.status(500).send("Error loading edit form.");
  }
};

export const handleEditedBook = async (req, res) => {
  const id = req.params.id;
  try {
    await updateBook(req.body, id);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to update book.");
  }
};

export const handleDeleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    await deleteBook(bookId);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).send("Failed to delete book.");
  }
};
