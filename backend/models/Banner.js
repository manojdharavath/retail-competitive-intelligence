const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  retailer: { type: String, required: true },
  country: { type: String, required: true },
  title: { type: String, required: true },
  discount: { type: Number, default: 0 },
  badge: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  targetUrl: { type: String, default: '' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Banner', bannerSchema);
