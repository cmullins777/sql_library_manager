const express = require('express');
const router = express.Router();
const Book = require("../models").Book;

/* GET / to REDIRECT home route to /books route */
router.get('/', (req, res, next) => {
  res.redirect("/books/");
});

/* GET /books/ to show All Books (all_books.html) */
router.get('/', (req, res, next) => {
  Book.findAll({order: [["Title", "ASC"]]}).then(function(books) {
    res.render("books/index", {books:books, title: "List of Books"});
  }).catch((error) => {
      res.send(500, error);
   });
});

/* GET /books/new to show New Book form (new_book.html) */
router.get('/', (req, res, next) => {
  Books.create(req.body).then((book) => {
    res.render("/books/new-book");
  }).catch((error) => {
      res.send(500, error);
   });
});

/* POST /books/new to post New Book (new_book.html)*/
router.post('/', (req, res, next) => {
  Books.create(req.body).then((book) => {
    res.redirect("/books/" + book.id);
  }).catch((error) => {
    if(error.name === "SequelizeValidationError") {
      res.render("books/new-book", {
        book: Book.build(req.body),
        title: "New Book",
        errors: error.errors
      });
    } else {
      throw error;
    }
  }).catch((error) => {
      res.send(500, error);
   });
});

/* GET /books/:id to show Update Book form (book_detail.html) */
router.get("/:id", (req, res, next) => {
  Book.findById(req.params.id).then( (book) => {
    if(book) {
      res.render("books/show", {book: book, title: book.title});
    } else {
      res.send(404);
    }
  }).catch((err) => {
    res.send(500);
  });
});

/* POST /books/:id to edit and Update Book (book_detail.html)*/
router.post("/:id", (req, res, next) => {
  Book.findById(req.params.id).then( (book) => {
    if(book) {
      return book.update(req.body);
    } else {
      res.send(404);
    }
  }).then ((book) => {
    res.redirect("/books/" + book.id);
  }).catch((err) => {
    res.send(500);
  });
});

/* POST /books/:id/delete to Delete Book (book_detail.html) */
router.delete("/:id", (req, res, next) => {
  Book.findById(req.params.id).then( (book) => {
    if(book) {
      return book.destroy();
    } else {
      res.send(404);
    }
  }).then( () => {
    res.redirect("/books");
  });
});

module.exports = router;
