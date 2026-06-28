const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, 'Quantity cannot be less than 1.']
  },
  totalAmount: {
    type: Number,
    required: true // quantity * product.price
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    type: String,
    required: [true, 'Shipping address is required for checkout.']
  }
}, {
  timestamps: true
});

// Index to quickly pull orders matching a specific user (either as buyer or seller)
orderSchema.index({ buyer: 1, seller: 1 });

module.exports = mongoose.model('Order', orderSchema);