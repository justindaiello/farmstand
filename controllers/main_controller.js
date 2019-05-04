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
  Product.find({}, (err, allProducts) => {
    res.render('new.ejs', { product: allProducts } )
  })
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

//===============
// EDIT PRODUCTS
//===============
router.get('/shop/edit', (req, res) => {
  res.render('edit.ejs')
})

//===========
// PUT
//===========
router.put('/shop/new', (req, res)=>{
    Product.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel)=>{
        res.redirect('/shop/new');
    });
});

//==============
// SHOW PAGE
//==============
router.get('/shop/:id', (req, res)=>{
  Product.findById(req.params.id, (err, foundProduct) => {
  res.render('show.ejs', { product: foundProduct })
  })
});

//===========
// LOGIN
//===========
router.get('/login', (req, res) => {
  res.render('login.ejs')
})

//======================
// SHOP / PRODUCT INDEX
//======================
router.get('/shop', (req, res) => {
  Product.find({}, (err, allProducts) => {
    res.render('shop.ejs', { product: allProducts } )
  })
})

//============
// SEED DATA
//============
router.get('/shop/seed', (req, res) => {
  Product.create([
    {
      name: 'Carrots',
      description: 'Freshly picked carrots with greens.',
      img: 'https://i.imgur.com/wQCvaQ0.jpg',
      price: 4,
      qty: 10
    },
    {
      name: 'Lettuce',
      description: 'Fresh heads of red and green butter lettuce.',
      img: 'https://i.imgur.com/c4hAQqW.jpg',
      price: 4,
      qty: 10
    },
    {
      name: 'Beans',
      description: 'Freshly picked green and purple beans',
      img: 'https://i.imgur.com/0goMThl.jpg',
      price: 4,
      qty: 10
    },
  ])
})

module.exports = router;
