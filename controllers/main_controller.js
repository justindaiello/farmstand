//=============
// DEPENDENCIES
//=============
const express = require('express');
const router = express.Router();
const Product = require('../models/products.js')


//=========================
// FARMERS PAGE / NEW ROUTE
//=========================
router.get('/shop/new', (req, res) => {
  res.render('new.ejs')
})

//==============
// POST
//==============
router.post('/shop/', (req, res) => {
  Product.create(req.body, (err, createdProduct) => {
    res.redirect('/')
  })
})

//==========
// INDEX
//==========
//localhost:3000
router.get('/' , (req, res) => {
  res.render('index.ejs');
});

//===========
// LOGIN
//===========
router.get('/login', (req, res) => {
  res.render('login.ejs')
})

//=================
// SHOP / SHOW PAGE
//=================
router.get('/shop', (req, res) => {
  res.render('shop.ejs')
})

module.exports = router;
