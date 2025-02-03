const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stockStatus: { type: Boolean, required: true }, // true for in stock, false for out of stock
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
