const express = require('express');
const router = express.Router();
const Book = require("../models").Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* GET /books/ to show All Books (all_books.html) */
router.get('/', (req, res, next) => {
  Book.findAll({order: [["Title", "ASC"]]}).then(function(books) {
    res.render("books/index", {books:books, title: "List of Books"});
  }).catch((err) => {
      res.send(500, error);
   });
});

/* GET /books/new to show New Book form (new_book.html) */
router.get('/new-book', (req, res, next) => {
  res.render("books/new-book", {book: {}, title: "New book"});
});

/* POST /books/new to post New Book (new_book.html)*/
router.post('/', (req, res, next) => {
  Book.create(req.body).then((book) => {
    res.redirect("/books/");
  }).catch((error) => {
    if(error.name === "SequelizeValidationError") {
      res.render("books/new-book", {
        book: Book.build(req.body),
        title: "New Book",
        errors: error.errors})
    } else {
      throw error;
    }
  }).catch((err) => {
      res.send(500, error);
   });
});

/* GET /books/:id to show Update Book form (book_detail.html) */
router.get("/:id", (req, res, next) => {
  Book.findByPk(req.params.id).then( (book) => {
    if(book) {
      res.render("books/update-book", {book: book, title: book.title});
    } else {
      res.send(404);
    }
  }).catch((err) => {
    res.send(500, error);
  });
});

/* Post /books/:id/ to Update Book (book_detail.html) */
router.post("/:id", (req, res, next) => {
  Book.findByPk(req.params.id).then((book) => {
    if(book) {
      return book.update(req.body);
    } else {
      res.send(404);
    }
  }).then((book) => {
    res.redirect("/books/");
  }).catch((error) => {
    if(error.name === "SequelizeValidationError") {
      const book = Book.build(req.body);
      book.id = req.params.id;

      res.render("books/update-book", {
        book: book,
        title: "Update Book",
        errors: error.errors})
      } else {
        throw err;
      }
  }).catch((err) => {
    res.send(500, error);
  });
});

/* POST /books/:id/delete to Delete Book (book_detail.html) */
router.post("/:id/delete", (req, res, next) => {
  Book.findByPk(req.params.id).then((book) => {
    if(book) {
      return book.destroy();
    } else {
      res.render("books/page-not-found");
    }
  }).then( () => {
    res.redirect("/books");
  }).catch((err) => {
    res.send(500, error);
  });
});

module.exports = router;
