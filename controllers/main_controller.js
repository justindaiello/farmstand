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
    .exec((error, user) => {
      if (error) {
      next(error);
      } else {
        Product.find({ usersId: req.session.userId }, (err, allProducts) => {
          res.render('new.ejs', { product: allProducts});
        });
      };
    });
});


//==============
// POST
//==============
router.post('/shop/', (req, res, next) => {
  req.body.usersId = req.session.userId
  Product.create(req.body, (err, createdProduct) => {
    res.redirect('/shop/new');
  });
});

//==========
// INDEX
//==========
router.get('/' , (req, res, next) => {
  res.render('index.ejs');
});

//===============
// REGISTER PAGE
//===============
router.get('/register', (req, res, next) => {
  res.render('register.ejs');
})

//post for register
router.post('/register', (req, res, next) => {
  if (req.body.email &&
      req.body.name &&
      req.body.password &&
      req.body.confirmPassword) {
      //confirm passwords match

        if (req.body.password !== req.body.confirmPassword) {
          const err = new Error('Passwords do not match');
          err.status = 400;
          next(err);
        };

        //create object for form data
        const userData = {
          email: req.body.email,
          name: req.body.name,
          password: req.body.password
        };

        // use schema's create method to insert doc into mongo
        User.create(userData, (error, user) => {
          if (error) {
          next(error);
          } else {
            req.session.userId = user._id;
            res.redirect('/shop/new');
          };
        });

      } else {
        const err = new Error('All fields required');
        err.status = 400;
        next(err);
      }
})

//===============
// EDIT PRODUCTS
//===============
router.get('/shop/:id/edit', mid.requiresLogin, (req, res, next) => {
  User.findById(req.session.userId)
    .exec( (error, user) => {
      if (error) {
      next(error);
      } else {
        Product.findById(req.params.id, (err, foundProducts) => {
            res.render('edit.ejs', { product: foundProducts });
        });
      };
    });
});


//==============
// SHOW PAGE
//==============
router.get('/shop/:id', (req, res, next) => {
  Product.findById(req.params.id, (err, foundProduct) => {
  res.render('show.ejs', { product: foundProduct });
  });
});

//===========
// LOGIN
//===========
router.get('/login', mid.loggedOut, (req, res, next) => {
  res.render('login.ejs');
})

//post for login
router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if (error || !user) {
        const err = new Error('Wrong email or password.');
        err.status = 401;
        next(err);
      } else {
        req.session.userId = user._id;
        res.redirect('/shop/new')
      };
    });
  } else {
    const err = new Error('Email and password are required.');
    err.status = 401;
    next(err);
  };
});

//==========
// LOGOUT
//==========
router.get('/logout', (req, res, next) => {
//if there is a current session..
  if (req.session) {
//delete session
    req.session.destroy( (err) => {
      if (err) {
        return next(err);
      } else {
        res.redirect('/')
      };
    });
  };
})

//======================
// SHOP / PRODUCT INDEX
//======================
router.get('/shop', (req, res, next) => {
  Product.find({}, (err, allProducts) => {
    res.render('shop.ejs', { product: allProducts });
  });
});

//===========
// PUT
//===========
//for farmer to update all of the details of their item on the edit page.
router.put('/shop/:id/edit', (req, res, next) => {
    Product.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel) => {
        res.redirect('/shop/new');
    });
});

//===========
// PUT
//===========
//for customers to reserve items and subtract from product.qty in the database
router.put('/shop/:id', (req, res, next) => {
    let qty = parseInt(req.body.qty);
    if (qty < qty) {
      alert('NO!');
      return
    } else {
    Product.findByIdAndUpdate(req.params.id, {$inc: {qty: -qty}}, {new:true}, (err, updatedModel) => {
        res.redirect(`/shop/${req.params.id}`); //redirect back to previous ID page.
    });
  }
});

//========
// DELETE
//========
router.delete('/shop/:id/edit', (req, res, next) => {
  Product.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect('/shop/new');
  });
});

//============
// SEED DATA
//============
// router.get('/seed', (req, res, next) => {
//   Product.create([
//     {
//       name: 'Sorrel',
//       description: 'Need to step up your plating game? Our red veined sorrel will take you to amateur to pro in an instant.',
//       img: 'https://i.imgur.com/T7DzRyF.jpg',
//       farmName: 'Ellie\'s Farm',
//       price: 14,
//       qty: 10
//     },
//     {
//       name: 'Blueberries',
//       description: 'Pick you own blueberries is sooo last year. We picked them for you and they\'re delicious! Get them before they\'re gone',
//       img: 'https://i.imgur.com/cC6Jz4I.jpg',
//       farmName: 'Archer\'s Farm',
//       price: 4,
//       qty: 30
//     },
//     {
//       name: 'Carrots',
//       description: 'Freshly picked carrots with greens. Use the fresh greens to make carrot-top pesto!',
//       img: 'https://i.imgur.com/wQCvaQ0.jpg',
//       farmName: 'Skylight Farm',
//       price: 4,
//       qty: 10
//     },
//     {
//       name: 'Lettuce',
//       description: 'Fresh heads of red and green butter lettuce. Our lettuce will stay fresh for up to 10 days!',
//       img: 'https://i.imgur.com/c4hAQqW.jpg',
//       farmName: 'Skylight Farm',
//       price: 5,
//       qty: 100
//     },
//     {
//       name: 'Beans',
//       description: 'Freshly picked green and purple beans. These beans are stringless and great raw or cooked.',
//       img: 'https://i.imgur.com/0goMThl.jpg',
//       farmName: 'Archer\'s Farm',
//       price: 3,
//       qty: 40
//     },
//     {
//       name: 'Broccoli',
//       description: 'Frost sweeted heirloom broccoli. This broccoli is super sweet and tender.',
//       img: 'https://i.imgur.com/cufPDiF.jpg',
//       farmName: 'Archer\'s Farm',
//       price: 3,
//       qty: 70
//     },
//     {
//       name: 'Pea Shoots',
//       description: 'Sweet and crunchy pea shoots harvested fresh. These are great in smoothies, salads and sandwhiches.',
//       img: 'https://i.imgur.com/2UnTv8W.jpg',
//       farmName: 'Archer\'s Farm',
//       price: 15,
//       qty: 10
//     },
//     {
//       name: 'Romanesco',
//       description: 'Beautiful and delicious. Romanesco cauliflower is sweet and crunchy and cooks quickly. Quantity is limited so reserve yours now!',
//       img: 'https://i.imgur.com/o5oDDIA.jpg',
//       farmName: 'Ellie\'s Farm',
//       price: 8,
//       qty: 30
//     },
//     {
//       name: 'Cauliflower',
//       description: 'Beautiful and delicious. Orange cauliflower is sweet and crunchy and cooks quickly. Quantity is limited so reserve yours now!',
//       img: 'https://i.imgur.com/vvAOjnb.jpg',
//       farmName: 'Ellie\'s Farm',
//       price: 8,
//       qty: 30
//     },
//     {
//       name: 'Baby Kale',
//       description: 'Full grown kale is overrated! Get some of this super sweet and tender baby kale before its gone!',
//       img: 'https://i.imgur.com/vvAOjnb.jpg',
//       farmName: 'Ellie\'s Farm',
//       price: 10,
//       qty: 50
//     },
//     {
//       name: 'Sweet Peppers',
//       description: 'Our specialty sweet pepper mix is the best in town! These are much sweeter than a traditional bell pepper and are a must try.',
//       img: 'https://i.imgur.com/I6GW062.jpg',
//       farmName: 'Skylight Farm',
//       price: 4,
//       qty: 45
//     },
//     {
//       name: 'Cherry Tomatoes',
//       description: 'You\'ve never had a sweet tomato until you\'ve had a sungold! These are a staff favorite.',
//       img: 'https://i.imgur.com/pr304jx.jpg',
//       farmName: 'Skylight Farm',
//       price: 5,
//       qty: 50
//     },
//   ])
// })

module.exports = router;
