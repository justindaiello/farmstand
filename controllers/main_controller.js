//=============
// DEPENDENCIES
//=============
const express = require('express');
const router = express.Router();

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
