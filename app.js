import express from "express";
import bodyParser from "body-parser";
import {
  addBookForm,
  editBookForm,
  handleEditedBook,
  handleNewBook,
  renderHomePage,
  handleDeleteBook,
} from "./controllers/bookcontroller";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", renderHomePage);

app.get("/add", addBookForm);

app.post("/add", handleNewBook);

app.get("/edit/:id", editBookForm);

app.post("/edit/:id", handleEditedBook);

app.post("/delete/:id", handleDeleteBook);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
