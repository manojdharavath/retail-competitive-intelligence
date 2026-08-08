const mongoose = require('mongoose');

const searchVisibilitySchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  brand: { type: String, required: true },
  retailer: { type: String, required: true },
  country: { type: String, required: true },
  ranking: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchVisibility', searchVisibilitySchema);
