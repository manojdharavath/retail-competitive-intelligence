const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const RetailerAudit = require('../models/RetailerAudit');

// @desc    Get all products with filtering, search, and pagination
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { brand, oem, productType, retailer, country, search, sort } = req.query;

  const query = {};
  if (brand) query.brand = brand;
  if (oem) query.oem = oem;
  if (productType) query.productType = productType;
  if (retailer) query.retailer = retailer;
  if (country) query.country = country;
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { processor: { $regex: search, $options: 'i' } },
      { gpu: { $regex: search, $options: 'i' } }
    ];
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'discount_desc') sortOption = { discount: -1 };

  const products = await Product.find(query).sort(sortOption);
  res.json(products);
});

// @desc    Get single product by ID with price history and compliance audits
// @route   GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const priceHistory = await PriceHistory.find({ productId: product._id }).sort({ date: 1 });
  const audit = await RetailerAudit.findOne({ productId: product._id });

  res.json({
    product,
    priceHistory,
    audit
  });
});

module.exports = {
  getProducts,
  getProductById
};
