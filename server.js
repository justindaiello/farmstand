//===============
// DEPENDENCIES
//===============
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride  = require('method-override');
const session = require('express-session')
const bodyParser = require('body-parser');
const db = mongoose.connection;

//============
// MIDDLEWARE
//============
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded());

//use sessions middleware for tracking logins. NOT in an .env file for class presentation.
app.use(session({
  secret: 'muffins',
  resave: true,
  saveUninitialized: false,
}));

//make the user ID available in the templates middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

//=============
// CONTROLLER
//=============
const controller = require('./controllers/main_controller.js');
app.use('/', controller);

//=======
// PORT
//=======
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//===========
// DATABASE
//===========
//Connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/farmstand';

// Connect to Mongo
mongoose.connect(MONGODB_URI ,  { useNewUrlParser: true});
db.on('open', () => {
  console.log('connected to mongo');
});

//=================
// ERROR / SUCCESS
//=================
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// Get the 404 and send it to the error handler
app.use((req, res, next) => {
  const err = new Error('Uh oh! I looks like this page doesn\'t exist!');
  err.status = 404;
  next(err);
});

//Error handler...needs to be last middleware.
app.use( (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error.ejs', {
    message: err.message,
    error: {}
  });
})

//==========
// LISTENER
//==========
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
