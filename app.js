const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const sequelize = require("./models").sequelize;
let path = require('path');

// Gets the client
const mysql = require('mysql2');

// Set up view engine, pug, express.static
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = path.join(__dirname, 'views');
app.use(express.static(path.join(__dirname, 'public')));

//Routes
var routes = require('./routes/index');
var books = require('./routes/books');

//Access routes
app.use('/', routes);
app.use('/books', books);

// Handles 404 errors displaying page-not-found.pug
app.use((req, res, next) => {
  let err = new Error;
  err.status = 404;
  res.render('books/page-not-found');
  next(err);
});

// Handles server errors displaying error.pug
app.use((err, req, res, next) => {
  res.render('error', {
    message: err.message,
    err: err
  });
});

// Set server to start on localhost:3000
sequelize.sync()
.then(() => {
  app.listen(3000, () =>
  console.log('Server is running on port 3000.'));
});

module.exports = app;
