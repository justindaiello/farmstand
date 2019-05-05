//=============
// DEPENDENCIES
//=============
const express = require('express');
const router = express.Router();
const Product = require('../models/products.js');
const User = require('../models/users.js');
const mid = require('../middleware/mid.js')


//=========================
// FARMERS PAGE / NEW ROUTE
//=========================
router.get('/shop/new', mid.requiresLogin, (req, res, next) => {
  User.findById(req.session.userId)
    .exec( (error, user) => {
      if (error) {
        return next(error)
      } else {
        Product.find({}, (err, allProducts) => {
          res.render('new.ejs', { product: allProducts } )
        })
      }
    });
})


//==============
// POST
//==============
router.post('/shop/', (req, res, next) => {
  Product.create(req.body, (err, createdProduct) => {
    res.redirect('/shop/new')
  })
})

//==========
// INDEX
//==========
//localhost:3000
router.get('/' , (req, res, next) => {
  res.render('index.ejs');
});

//===============
// REGISTER PAGE
//===============
router.get('/register', (req, res, next) => {
  res.render('register.ejs');
})

router.post('/register', (req, res, next) => {
  if (req.body.email &&
      req.body.name &&
      req.body.password &&
      req.body.confirmPassword) {
      //confirm passwords match

        if (req.body.password !== req.body.confirmPassword) {
          const err = new Error('Passwords do not match');
          err.status = 400;
          return next(err);
        }

        //create object for form data
        const userData = {
          email: req.body.email,
          name: req.body.name,
          password: req.body.password
        };

        // use schema's create method to insert doc into mongo
        User.create(userData, (error, user) => {
          if (error) {
            return next(error);
          } else {
            req.session.userId = user._id;
            return res.redirect('/shop/new')
          }
        })

      } else {
        const err = new Error('All fields required');
        err.status = 400;
        return next(err);
      }
})

//===============
// EDIT PRODUCTS
//===============
router.get('/shop/:id/edit', mid.requiresLogin, (req, res, next)=>{
  User.findById(req.session.userId)
    .exec( (error, user) => {
      if (error) {
        return next(error)
      } else {
        Product.findById(req.params.id, (err, foundProducts)=>{
            res.render(
            'edit.ejs',
            {
              product: foundProducts
            }
          );
        });
      }
    });
});


//==============
// SHOW PAGE
//==============
router.get('/shop/:id', (req, res, next)=>{
  Product.findById(req.params.id, (err, foundProduct) => {
  res.render('show.ejs', { product: foundProduct })
  })
});

//===========
// LOGIN
//===========
router.get('/login', mid.loggedOut, (req, res, next) => {
  res.render('login.ejs')
})

//Post for /login
router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if (error || !user) {
        const err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/shop/new')
      }
    });
  } else {
    const err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
})

//==========
// LOGOUT
//==========
router.get('/logout', (req, res, next) => {
  if (req.session) {
    //delete session
    req.session.destroy( (err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/')
      }
    });
  }
})

//======================
// SHOP / PRODUCT INDEX
//======================
router.get('/shop', (req, res, next) => {
  Product.find({}, (err, allProducts) => {
    res.render('shop.ejs', { product: allProducts } )
  })
})

//===========
// PUT
//===========
router.put('/shop/:id/edit', (req, res, next)=>{
    Product.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel)=>{
        res.redirect('/shop/new');
    });
});

//===========
// PUT
//===========
router.put('/shop/:id', (req, res, next)=>{
    Product.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel)=>{
        res.redirect(`/shop/${req.params.id}`);
    });
});

//========
// DELETE
//========
router.delete('/shop/:id/edit', (req, res, next) => {
  Product.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect('/shop/new')
  })
})

//============
// SEED DATA
//============
router.get('/seed', (req, res, next) => {
  Product.create([
    {
      name: 'Carrots',
      description: 'Freshly picked carrots with greens.',
      img: 'https://i.imgur.com/wQCvaQ0.jpg',
      farmName: 'Skylight Farm',
      price: 4,
      qty: 10
    },
    {
      name: 'Lettuce',
      description: 'Fresh heads of red and green butter lettuce.',
      img: 'https://i.imgur.com/c4hAQqW.jpg',
      farmName: 'Skylight Farm',
      price: 4,
      qty: 10
    },
    {
      name: 'Beans',
      description: 'Freshly picked green and purple beans',
      img: 'https://i.imgur.com/0goMThl.jpg',
      farmName: 'Archer\'s Farm',
      price: 4,
      qty: 10
    },
  ])
})

module.exports = router;
