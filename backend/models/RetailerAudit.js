const mongoose = require('mongoose');

const retailerAuditSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  brand: { type: String, required: true },
  retailer: { type: String, required: true },
  country: { type: String, required: true },
  productType: { type: String, required: true },
  S1: { type: Boolean, default: false },
  S2: { type: Boolean, default: false },
  P1: { type: Boolean, default: false },
  P2: { type: Boolean, default: false },
  P3: { type: Boolean, default: false },
  P4: { type: Boolean, default: false },
  P5: { type: Boolean, default: false },
  auditScore: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RetailerAudit', retailerAuditSchema);
