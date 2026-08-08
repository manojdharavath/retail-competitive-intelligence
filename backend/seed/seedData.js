const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const RetailerAudit = require('../models/RetailerAudit');
const Banner = require('../models/Banner');
const SearchVisibility = require('../models/SearchVisibility');

dotenv.config();

const brandsData = [
  {
    brand: 'Intel',
    oems: ['Dell', 'HP', 'Lenovo', 'Acer', 'Asus', 'MSI'],
    processors: ['Intel Core Ultra 7 155H', 'Intel Core Ultra 9 185H', 'Intel Core i9-14900HX', 'Intel Core i7-14700K', 'Intel Core i5-13500H'],
    gpus: ['NVIDIA RTX 4070', 'NVIDIA RTX 4080', 'NVIDIA RTX 4060', 'Intel Arc A770', 'NVIDIA RTX 4090'],
    badgesList: [['Core Ultra', 'Evo'], ['Core Ultra', 'vPro'], ['Core'], ['Core', 'Evo']],
    componentNames: ['Intel Core i9-14900K Processor', 'Intel Core Ultra 7 265K Desktop Processor', 'Intel Arc B580 Graphics Card']
  },
  {
    brand: 'AMD',
    oems: ['Dell', 'HP', 'Lenovo', 'Acer', 'Asus', 'MSI'],
    processors: ['AMD Ryzen 7 8845HS', 'AMD Ryzen AI 9 HX 370', 'AMD Ryzen 9 7945HX', 'AMD Ryzen 7 7800X3D', 'AMD Ryzen 5 7600X'],
    gpus: ['NVIDIA RTX 4070', 'AMD Radeon RX 7900 XTX', 'NVIDIA RTX 4060', 'AMD Radeon RX 7600M XT', 'NVIDIA RTX 4080'],
    badgesList: [['Ryzen', 'Ryzen AI'], ['Ryzen'], ['Ryzen', 'Ryzen AI']],
    componentNames: ['AMD Ryzen 7 7800X3D Processor', 'AMD Ryzen 9 7950X3D Processor', 'AMD Radeon RX 7900 XTX GPU']
  },
  {
    brand: 'Qualcomm',
    oems: ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer'],
    processors: ['Qualcomm Snapdragon X Elite X1E-80-100', 'Qualcomm Snapdragon X Plus X1P-64-100', 'Qualcomm Snapdragon X Elite X1E-78-100'],
    gpus: ['Qualcomm Adreno GPU'],
    badgesList: [['Snapdragon'], ['Snapdragon', 'Copilot+ PC']],
    componentNames: ['Qualcomm Snapdragon X Elite Development Kit']
  },
  {
    brand: 'Apple',
    oems: ['Apple'],
    processors: ['Apple M3 Pro (12-core)', 'Apple M3 Max (16-core)', 'Apple M4 Chip', 'Apple M2 Ultra'],
    gpus: ['Apple 18-Core GPU', 'Apple 40-Core GPU', 'Apple 10-Core GPU', 'Apple 76-Core GPU'],
    badgesList: [['Apple Silicon', 'M-series'], ['Apple Silicon']],
    componentNames: []
  }
];

const productTypes = ['Notebook', 'Desktop', 'Workstation', 'Tablet', 'CPU/GPU component'];
const retailers = [
  { name: 'Newegg', country: 'US', currency: 'USD', factor: 1 },
  { name: 'Mercado Libre', country: 'Brazil', currency: 'USD', factor: 1 }
];

const sampleKeywords = ['gaming laptop', 'thin and light laptop', 'workstation PC', 'AI PC', 'desktop processor', 'high performance notebook'];

const seedDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log('Clearing existing database collections...');
    await Product.deleteMany({});
    await PriceHistory.deleteMany({});
    await RetailerAudit.deleteMany({});
    await Banner.deleteMany({});
    await SearchVisibility.deleteMany({});

    console.log('Generating seed data...');

    const seededProducts = [];

    // 1. Generate ~75 Products
    for (let i = 0; i < 75; i++) {
      const brandObj = brandsData[i % brandsData.length];
      const retailerObj = retailers[i % retailers.length];
      
      let pType = productTypes[i % productTypes.length];
      let oem = brandObj.brand === 'Apple' ? 'Apple' : brandObj.oems[i % brandObj.oems.length];
      
      if (pType === 'CPU/GPU component') {
        if (brandObj.brand === 'Apple') {
          pType = 'Notebook'; // Apple does not sell standalone components
        } else {
          oem = 'N/A';
        }
      }

      const proc = brandObj.processors[i % brandObj.processors.length];
      const gpu = brandObj.gpus[i % brandObj.gpus.length];
      const ram = pType === 'CPU/GPU component' ? 'N/A' : (i % 2 === 0 ? '16GB DDR5' : '32GB DDR5');
      const storage = pType === 'CPU/GPU component' ? 'N/A' : (i % 3 === 0 ? '1TB NVMe SSD' : '512GB SSD');
      const badges = brandObj.badgesList[i % brandObj.badgesList.length];

      let basePrice = 699 + ((i * 37) % 2100);
      if (brandObj.brand === 'Apple') basePrice += 400;
      if (pType === 'Workstation') basePrice += 600;

      const discountPercent = (i % 3 === 0 || i % 5 === 1) ? Math.floor(8 + ((i * 7) % 22)) : 0;
      const originalPrice = discountPercent > 0 ? Math.round(basePrice * (1 + discountPercent / 100)) : basePrice;


      let title = '';
      if (pType === 'CPU/GPU component' && brandObj.componentNames.length > 0) {
        title = brandObj.componentNames[i % brandObj.componentNames.length];
      } else {
        title = `${oem} ${pType} - ${proc} (${ram}, ${storage})`;
      }

      const product = await Product.create({
        title,
        brand: brandObj.brand,
        oem,
        productType: pType,
        retailer: retailerObj.name,
        country: retailerObj.country,
        price: basePrice,
        originalPrice,
        discount: discountPercent,
        currency: retailerObj.currency,
        processor: proc,
        gpu,
        ram,
        storage,
        badges,
        productUrl: `https://www.${retailerObj.name.toLowerCase().replace(' ', '')}.com/product/${i + 1000}`,
        imageUrl: `https://picsum.photos/seed/prod${i}/400/300`
      });

      seededProducts.push(product);
    }

    console.log(`Created ${seededProducts.length} Products.`);

    // 2. Generate Price History (30 days of data for each product)
    const priceHistories = [];
    const now = new Date();

    for (const prod of seededProducts) {
      for (let day = 30; day >= 0; day -= 5) {
        const histDate = new Date(now);
        histDate.setDate(now.getDate() - day);
        
        const flux = (day % 3 === 0 ? -1 : 1) * (day * 4);
        const histPrice = Math.max(200, prod.price + flux);
        const histDiscount = prod.discount > 0 ? Math.max(5, prod.discount + (day % 4 - 2)) : 0;

        priceHistories.push({
          productId: prod._id,
          brand: prod.brand,
          retailer: prod.retailer,
          country: prod.country,
          price: histPrice,
          discount: histDiscount,
          date: histDate
        });
      }
    }

    await PriceHistory.insertMany(priceHistories);
    console.log(`Created ${priceHistories.length} PriceHistory records.`);

    // 3. Generate Retailer Audit records
    const auditRecords = [];
    for (const prod of seededProducts) {
      const S1 = Math.random() > 0.15;
      const S2 = Math.random() > 0.25;
      const P1 = Math.random() > 0.10;
      const P2 = Math.random() > 0.30;
      const P3 = Math.random() > 0.05;
      const P4 = prod.brand === 'Intel' || prod.brand === 'Apple' ? Math.random() > 0.2 : Math.random() > 0.45;
      const P5 = Math.random() > 0.35;

      const checks = [S1, S2, P1, P2, P3, P4, P5];
      const passedCount = checks.filter(Boolean).length;
      const auditScore = Math.round((passedCount / checks.length) * 100);

      auditRecords.push({
        productId: prod._id,
        brand: prod.brand,
        retailer: prod.retailer,
        country: prod.country,
        productType: prod.productType,
        S1, S2, P1, P2, P3, P4, P5,
        auditScore,
        date: now
      });
    }

    await RetailerAudit.insertMany(auditRecords);
    console.log(`Created ${auditRecords.length} RetailerAudit records.`);

    // 4. Generate Banners
    const banners = [
      { brand: 'Intel', retailer: 'Newegg', country: 'US', title: 'Intel Core Ultra Gaming Event - Up to 20% Off', discount: 20, badge: 'Featured Brand' },
      { brand: 'Intel', retailer: 'Newegg', country: 'US', title: 'Dell Powered by Intel Core Ultra - Free Shipping', discount: 15, badge: 'Top Seller' },
      { brand: 'Intel', retailer: 'Mercado Libre', country: 'Brazil', title: 'Ofertas Intel Gamer Brasil', discount: 18, badge: 'Destaque' },
      { brand: 'AMD', retailer: 'Newegg', country: 'US', title: 'AMD Ryzen 7800X3D Ultimate Gaming Deals', discount: 25, badge: 'Editor Choice' },
      { brand: 'AMD', retailer: 'Newegg', country: 'US', title: 'Asus ROG AMD Ryzen Laptops Super Sale', discount: 22, badge: 'Limited Offer' },
      { brand: 'AMD', retailer: 'Mercado Libre', country: 'Brazil', title: 'Semanas de Processadores AMD Ryzen', discount: 30, badge: 'Promoção' },
      { brand: 'Qualcomm', retailer: 'Newegg', country: 'US', title: 'Next-Gen Copilot+ PCs powered by Snapdragon X Elite', discount: 10, badge: 'New Tech' },
      { brand: 'Qualcomm', retailer: 'Mercado Libre', country: 'Brazil', title: 'Notebooks Snapdragon Ultrafinos e Bateria 24h', discount: 12, badge: 'Inovação' },
      { brand: 'Apple', retailer: 'Newegg', country: 'US', title: 'Apple MacBook Pro M3 Max Workstation Sale', discount: 8, badge: 'Apple Event' },
      { brand: 'Apple', retailer: 'Mercado Libre', country: 'Brazil', title: 'Apple Silicon Days - MacBooks com Desconto', discount: 10, badge: 'Imperdível' }
    ];

    await Banner.insertMany(banners);
    console.log(`Created ${banners.length} Banner records.`);

    // 5. Generate Search Visibility records
    const searchRecords = [];
    const brandList = ['Intel', 'AMD', 'Qualcomm', 'Apple'];

    sampleKeywords.forEach(keyword => {
      retailers.forEach(ret => {
        brandList.forEach((b, idx) => {
          let baseRank = (idx + 1) * 2;
          if (b === 'Intel' && keyword.includes('gaming')) baseRank = 1;
          if (b === 'AMD' && keyword.includes('processor')) baseRank = 1;
          if (b === 'Apple' && keyword.includes('notebook')) baseRank = 3;
          if (b === 'Qualcomm' && keyword.includes('AI')) baseRank = 2;

          searchRecords.push({
            keyword,
            brand: b,
            retailer: ret.name,
            country: ret.country,
            ranking: Math.min(10, Math.max(1, baseRank + (Math.floor(Math.random() * 3) - 1))),
            date: now
          });
        });
      });
    });

    await SearchVisibility.insertMany(searchRecords);
    console.log(`Created ${searchRecords.length} SearchVisibility records.`);

    console.log('Seed database completed successfully!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = seedDB;
