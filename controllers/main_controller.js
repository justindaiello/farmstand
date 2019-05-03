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
  res.send('Hello World!');
});


module.exports = router;
