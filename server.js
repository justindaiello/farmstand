//===============
// DEPENDENCIES
//===============
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require('mongoose');
const app = express();
const db = mongoose.connection;

//=======
// PORT
//=======
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//============
// MIDDLEWARE
//============
//use public folder for static assets
app.use(express.static('public'));
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
// extended: false - does not allow nested objects in query strings
app.use(express.urlencoded({ extended: true }));
// returns middleware that only parses JSON - may or may not need it depending on your project
app.use(express.json());
//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//===========
// DATABASE
//===========
//Connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/farmstand';

// Connect to Mongo
mongoose.connect(MONGODB_URI ,  { useNewUrlParser: true});
mongoose.connection.once('open', ()=> {
    console.log('connected to mongo...');
});

//=================
// ERROR / SUCCESS
//=================
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// open the connection to mongo
// db.on('open' , ()=>{});


//==========
// INDEX
//==========
//localhost:3000
app.get('/' , (req, res) => {
  res.send('Hello World!');
});

//==========
// LISTENER
//==========
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
