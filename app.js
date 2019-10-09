require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


// import your api 
require('./app_api/db');  
const apiRouter = require('./app_api/index');

// start your server
const app = express();

// bring in views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// add middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// let the browser access these directory as is. this is where we keep all the front-end files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public', 'build')));

// resolve CORS issues; add headers to all api responses so they can come from different ports
app.use('/api', (req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // add Authorization for passport
  next();
});


// send user requests to the right functions
app.use('/api', apiRouter);
app.get('*', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'app_public', 'build', 'index.html'));
});

// handle error
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
