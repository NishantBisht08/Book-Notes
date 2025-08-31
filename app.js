import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books");
    const editId = req.query.edit || null;
    res.render("index.ejs", { Book: result.rows, editId });
  } catch (error) {
    res.status(500).send("some thing went wrong");
  }
});
app.get("/add", (req, res) => {
  res.render("add.ejs");
});
app.post("/add", async (req, res) => {
  try {
    const apiURL = `https://openlibrary.org/search.json?title=${encodeURIComponent(
      req.body.title
    )}&author=${encodeURIComponent(req.body.author)}`;

    const response = await axios.get(apiURL);

    let coverId = null;
    if (response.data.docs.length > 0 && response.data.docs[0].cover_i) {
      coverId = response.data.docs[0].cover_i;
    }

    await db.query(
      "INSERT INTO books (title, author, notes, rating, date_read, cover_id) VALUES($1, $2, $3, $4, $5, $6)",
      [
        req.body.title,
        req.body.author,
        req.body.notes,
        req.body.rating,
        req.body.date_read,
        coverId,
      ]
    );
    res.redirect("/");
  } catch (error) {
    console.error("Error adding book:", error); // <== Add this line
    res.status(500).send("Failed to add book.");
  }
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    res.render("edit.ejs", { book: result.rows[0] });
  } catch (error) {
    res.status(500).send("Error loading edit form.");
  }
});

app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.query(
      `UPDATE books SET title=$1, author=$2, notes=$3, rating=$4, date_read=$5 WHERE id=$6`,
      [
        req.body.title,
        req.body.author,
        req.body.notes,
        req.body.rating,
        req.body.date_read,
        id,
      ]
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to update book.");
  }
});

app.post("/delete/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    await db.query("DELETE FROM books WHERE id = $1", [bookId]);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).send("Failed to delete book.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
