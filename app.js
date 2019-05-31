const express = require('express');
const app = express();
const sequelize = require("./models").sequelize;
let path = require('path');
// get the client
const mysql = require('mysql2');

const Books = require("./models").Book;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

//Routes
var index = require('./routes/index');
var books = require('./routes/books');

//Access routes
app.use('/index', index);
app.use('/books', books);

app.use((req, res, next) => {
  res.status(err.status || 500);
  res.render('error');
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

sequelize.sync()
.then(() => {
  app.listen(3000, () =>
  console.log('Server is running on port 3000.'));
});

module.exports = app;
