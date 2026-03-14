import express from "express";
import bodyParser from "body-parser";
import {
  addBookForm,
  editBookForm,
  handleEditedBook,
  handleNewBook,
  renderHomePage,
  handleDeleteBook,
} from "./controllers/bookcontroller.js";

const app = express();
const port = 3000;    

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", renderHomePage);

app.get("/add", addBookForm);

app.post("/add", handleNewBook);

app.get("/edit/:id", editBookForm);

app.post("/edit/:id", handleEditedBook);

app.post("/delete/:id", handleDeleteBook);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
//Vercel runs serverless functions, so Express must be exported as a module instead of listening on a port directly. Vercel will handle the routing and invocation of the Express app.
export default app;