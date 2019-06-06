const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const sequelize = require("./models").sequelize;
let path = require('path');

// get the client
const mysql = require('mysql2');

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

app.use((req, res, next) => {
  let err = new Error;
  err.status = 404;
  res.render('books/page-not-found');
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    err: err
  });
});

sequelize.sync()
.then(() => {
  app.listen(3000, () =>
  console.log('Server is running on port 3000.'));
});

module.exports = app;
