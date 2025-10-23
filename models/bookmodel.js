import pg from "pg";
import dotenv from "dotenv";
impor;

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

export async function getAllBooks() {
  try {
    const result = await db.query("SELECT * FROM books");
    return result.rows; // We only need to return the data
  } catch (error) {
    console.error("Error fetching all books:", error);
    throw error; // Let the controller handle the error
  }
}

export async function addBook(bookData, coverId) {
  //  (req) replaced with bookData
  try {
    await db.query(
      "INSERT INTO books (title, author, notes, rating, date_read, cover_id) VALUES($1, $2, $3, $4, $5, $6)",
      [
        bookData.title,
        bookData.author,
        bookData.notes,
        bookData.rating,
        bookData.date_read,
        coverId,
      ]
    );
    // We don't need to return anything for an INSERT, but we could
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
}

export async function getBookById(id) {
  try {
    const result = await db.query("SELECT * FROM books WHERE id=$1", [id]);
    return result.rows[0]; // We only need to return the data
  } catch (error) {
    console.error("Error fetching  book:", error);
    throw error; // Let the controller handle the error
  }
}

export async function updateBook(bookData, Id) {
  //  (req) replaced with bookData
  try {
    await db.query(
      "UPDATE books SET title=$1, author=$2, notes=$3, rating=$4, date_read=$5 WHERE id=$6",
      [
        bookData.title,
        bookData.author,
        bookData.notes,
        bookData.rating,
        bookData.date_read,
        Id,
      ]
    );
    // We don't need to return anything for an INSERT, but we could
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
}

export async function deleteBook(bookId) {
  try {
    const result = await db.query("DELETE FROM books WHERE id = $1", [bookId]);
  } catch (error) {
    console.error("Error fetching all books:", error);
    throw error; // Let the controller handle the error
  }
}

export default db;
