const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  saleStartTime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Sale', SaleSchema);
