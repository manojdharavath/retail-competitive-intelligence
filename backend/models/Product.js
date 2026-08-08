const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { 
    type: String, 
    required: true, 
    enum: ['Intel', 'AMD', 'Qualcomm', 'Apple'] 
  },
  oem: { 
    type: String, 
    required: true, 
    enum: ['Dell', 'HP', 'Lenovo', 'Acer', 'Asus', 'MSI', 'Apple', 'N/A'] 
  },
  productType: { 
    type: String, 
    required: true, 
    enum: ['Desktop', 'Notebook', 'Workstation', 'Tablet', 'CPU/GPU component'] 
  },
  retailer: { 
    type: String, 
    required: true, 
    enum: ['Newegg', 'Mercado Libre'] 
  },
  country: { 
    type: String, 
    required: true, 
    enum: ['US', 'Brazil'] 
  },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  processor: { type: String, default: '' },
  gpu: { type: String, default: '' },
  ram: { type: String, default: '' },
  storage: { type: String, default: '' },
  badges: [{ type: String }],
  productUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
