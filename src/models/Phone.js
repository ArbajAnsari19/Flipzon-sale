const mongoose = require('mongoose');

const PhoneSchema = new mongoose.Schema({
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  pickedUpAt: {
    type: Date,
    default: null,
  },
  pickedUpBy: {
    type: String,
    default: null,
  },
  purchasedBy: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('Phone', PhoneSchema);
