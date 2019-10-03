require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/*
// bring in models, controllers, passport
const passport = require('passport'); // passport must be required before model and config after
require('./app_api/models/db');
require('./app_api/config/passport');
*/

//const apiRouter = require('./app_api/routes/index');
const app = express();

// bring in views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// express middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// let the browser access these directory as is
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public', 'build')));
//app.use(passport.initialize()); // initialize after static routes

/* resolve CORS issues; add headers to all api responses so they can come from different ports
app.use('/api', (req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // add Authorization for passport
  next();
});
*/

// send requests 
//app.use('/api', apiRouter);
app.get('*', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'app_public', 'build', 'index.html'));
});


// failing jwt auth at API end points
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') res.status(401).json({ "message": err.name + ": " + err.message });
});


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
