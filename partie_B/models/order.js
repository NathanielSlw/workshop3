const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
