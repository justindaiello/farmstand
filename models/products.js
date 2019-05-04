//Have to require mongoose here
const mongoose = require('mongoose');


//=======
//SCHEMA
//=======
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  img: String,
  price: { type: Number, min: 0, required: true },
  qty: { type: Number, required: true }
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
