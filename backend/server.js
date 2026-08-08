const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const productRoutes = require('./routes/productRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const aiRoutes = require('./routes/aiRoutes');

const Product = require('./models/Product');
const seedDB = require('./seed/seedData');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Retail Competitive Intelligence API is running',
    timestamp: new Date()
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Auto seed database if empty
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('Database empty on start. Running automatic seed script...');
    await seedDB();
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  Backend API Server running on port ${PORT}      `);
    console.log(`  Health Check: http://localhost:${PORT}/api/health `);
    console.log(`====================================================`);
  });
};

startServer();
