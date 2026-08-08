const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  brand: { type: String, required: true },
  retailer: { type: String, required: true },
  country: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PriceHistory', priceHistorySchema);
