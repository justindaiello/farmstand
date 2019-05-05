//Have to require mongoose here
const mongoose = require('mongoose');


//=======
//SCHEMA
//=======
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
  farmName: { type: String, required: true },
  price: { type: Number, min: 0, required: true },
  qty: { type: Number, required: true }
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
