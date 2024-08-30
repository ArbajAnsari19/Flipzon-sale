const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  phoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phone',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  orderTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
