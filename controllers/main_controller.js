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


module.exports = router;
