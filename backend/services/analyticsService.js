const Product = require('../models/Product');
const RetailerAudit = require('../models/RetailerAudit');
const Banner = require('../models/Banner');
const SearchVisibility = require('../models/SearchVisibility');
const PriceHistory = require('../models/PriceHistory');

const buildFilterQuery = (filters = {}) => {
  const query = {};
  if (filters.brand) query.brand = filters.brand;
  if (filters.oem) query.oem = filters.oem;
  if (filters.retailer) query.retailer = filters.retailer;
  if (filters.country) query.country = filters.country;
  if (filters.productType) query.productType = filters.productType;
  return query;
};

// 1. KPI Summary & Dynamic Insights
const getSummaryAnalytics = async (filters) => {
  const query = buildFilterQuery(filters);

  const totalProducts = await Product.countDocuments(query);
  if (totalProducts === 0) {
    return {
      totalProducts: 0,
      avgPrice: 0,
      avgDiscount: 0,
      shareOfShelfLeader: 'N/A',
      complianceLeader: 'N/A',
      activePromotions: 0,
      insights: ['No products match the selected filters.']
    };
  }

  const priceStats = await Product.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        avgPrice: { $avg: '$price' },
        avgDiscount: { $avg: '$discount' },
        activePromos: {
          $sum: { $cond: [{ $gt: ['$discount', 0] }, 1, 0] }
        }
      }
    }
  ]);

  const avgPrice = Math.round(priceStats[0]?.avgPrice || 0);
  const avgDiscount = Number((priceStats[0]?.avgDiscount || 0).toFixed(1));
  const activePromotions = priceStats[0]?.activePromos || 0;

  // Share of Shelf Leader
  const brandCounts = await Product.aggregate([
    { $match: query },
    { $group: { _id: '$brand', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const topBrand = brandCounts[0];
  const shareLeaderPct = topBrand ? Math.round((topBrand.count / totalProducts) * 100) : 0;
  const shareOfShelfLeader = topBrand ? `${topBrand._id} (${shareLeaderPct}%)` : 'N/A';

  // Compliance Scores
  const complianceData = await getComplianceAnalytics(filters);
  const topCompliance = complianceData.sort((a, b) => b.complianceScore - a.complianceScore)[0];
  const complianceLeader = topCompliance ? `${topCompliance.brand} (${topCompliance.complianceScore}%)` : 'N/A';

  // Dynamic Insights Generator
  const pricingData = await getPricingAnalytics(filters);
  const sortedByDiscount = [...pricingData].sort((a, b) => b.avgDiscount - a.avgDiscount);
  const sortedByPrice = [...pricingData].sort((a, b) => b.avgPrice - a.avgPrice);

  const insights = [];
  if (sortedByDiscount.length > 0) {
    insights.push(`${sortedByDiscount[0].brand} currently offers the highest average discount at ${sortedByDiscount[0].avgDiscount}%.`);
  }
  if (topBrand) {
    insights.push(`${topBrand._id} dominates shelf space with a ${shareLeaderPct}% Share of Shelf across tracked products.`);
  }
  if (sortedByPrice.length > 0) {
    insights.push(`${sortedByPrice[0].brand} has the highest average retail price point at $${sortedByPrice[0].avgPrice.toLocaleString()}.`);
  }
  if (topCompliance) {
    insights.push(`${topCompliance.brand} achieves top retailer compliance with a ${topCompliance.complianceScore}% score across S1-S2 & P1-P5 guidelines.`);
  }

  return {
    totalProducts,
    avgPrice,
    avgDiscount,
    shareOfShelfLeader,
    complianceLeader,
    activePromotions,
    insights
  };
};

// 2. Share of Shelf
const getShareOfShelf = async (filters) => {
  const query = buildFilterQuery(filters);
  const totalProducts = await Product.countDocuments(query);

  if (totalProducts === 0) return [];

  const brandAggregation = await Product.aggregate([
    { $match: query },
    { $group: { _id: '$brand', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  return brandAggregation.map(item => ({
    brand: item._id,
    productCount: item.count,
    percentage: Number(((item.count / totalProducts) * 100).toFixed(1))
  }));
};

// 3. Pricing Analytics
const getPricingAnalytics = async (filters) => {
  const query = buildFilterQuery(filters);

  const pricing = await Product.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$brand',
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgDiscount: { $avg: '$discount' },
        totalCount: { $sum: 1 }
      }
    },
    { $sort: { avgPrice: -1 } }
  ]);

  return pricing.map(item => ({
    brand: item._id,
    avgPrice: Math.round(item.avgPrice),
    minPrice: item.minPrice,
    maxPrice: item.maxPrice,
    avgDiscount: Number(item.avgDiscount.toFixed(1)),
    totalCount: item.totalCount
  }));
};

// 4. Promotion Analytics
const getPromotionAnalytics = async (filters) => {
  const query = buildFilterQuery(filters);

  const promos = await Product.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$brand',
        avgDiscount: { $avg: '$discount' },
        discountedProducts: {
          $sum: { $cond: [{ $gt: ['$discount', 0] }, 1, 0] }
        },
        maxDiscount: { $max: '$discount' },
        totalProducts: { $sum: 1 }
      }
    },
    { $sort: { avgDiscount: -1 } }
  ]);

  return promos.map(item => ({
    brand: item._id,
    avgDiscount: Number(item.avgDiscount.toFixed(1)),
    discountedProducts: item.discountedProducts,
    maxDiscount: item.maxDiscount,
    totalProducts: item.totalProducts
  }));
};

// 5. Compliance Analytics (85% Notebook / 15% Desktop rollups as per prompt)
const getComplianceAnalytics = async (filters) => {
  const auditQuery = {};
  if (filters.brand) auditQuery.brand = filters.brand;
  if (filters.retailer) auditQuery.retailer = filters.retailer;
  if (filters.country) auditQuery.country = filters.country;
  if (filters.productType) auditQuery.productType = filters.productType;

  const audits = await RetailerAudit.find(auditQuery);

  const brands = ['Intel', 'AMD', 'Qualcomm', 'Apple'];
  const results = [];

  for (const b of brands) {
    const brandAudits = audits.filter(a => a.brand === b);
    if (brandAudits.length === 0) continue;

    // Separate Notebook vs Desktop/Other for weighted rollup
    const notebookAudits = brandAudits.filter(a => a.productType === 'Notebook');
    const desktopAudits = brandAudits.filter(a => a.productType !== 'Notebook');

    const calcAvg = (arr) => arr.length ? arr.reduce((acc, curr) => acc + curr.auditScore, 0) / arr.length : null;

    const notebookScore = calcAvg(notebookAudits);
    const desktopScore = calcAvg(desktopAudits);

    let weightedScore = 0;
    if (notebookScore !== null && desktopScore !== null) {
      weightedScore = Math.round(notebookScore * 0.85 + desktopScore * 0.15);
    } else if (notebookScore !== null) {
      weightedScore = Math.round(notebookScore);
    } else if (desktopScore !== null) {
      weightedScore = Math.round(desktopScore);
    } else {
      weightedScore = Math.round(calcAvg(brandAudits) || 0);
    }

    // Checkmark percentages for breakdown table
    const total = brandAudits.length;
    const S1_pass = Math.round((brandAudits.filter(a => a.S1).length / total) * 100) >= 60;
    const S2_pass = Math.round((brandAudits.filter(a => a.S2).length / total) * 100) >= 60;
    const P1_pass = Math.round((brandAudits.filter(a => a.P1).length / total) * 100) >= 60;
    const P2_pass = Math.round((brandAudits.filter(a => a.P2).length / total) * 100) >= 60;
    const P3_pass = Math.round((brandAudits.filter(a => a.P3).length / total) * 100) >= 60;
    const P4_pass = Math.round((brandAudits.filter(a => a.P4).length / total) * 100) >= 60;
    const P5_pass = Math.round((brandAudits.filter(a => a.P5).length / total) * 100) >= 60;

    results.push({
      brand: b,
      complianceScore: weightedScore,
      auditCount: total,
      checks: {
        S1: S1_pass,
        S2: S2_pass,
        P1: P1_pass,
        P2: P2_pass,
        P3: P3_pass,
        P4: P4_pass,
        P5: P5_pass
      }
    });
  }

  return results.sort((a, b) => b.complianceScore - a.complianceScore);
};

// 6. Banner Analytics
const getBannerAnalytics = async (filters) => {
  const query = {};
  if (filters.brand) query.brand = filters.brand;
  if (filters.retailer) query.retailer = filters.retailer;
  if (filters.country) query.country = filters.country;

  const banners = await Banner.find(query);
  const totalBanners = banners.length;

  if (totalBanners === 0) return [];

  const brandGroup = {};
  banners.forEach(b => {
    if (!brandGroup[b.brand]) {
      brandGroup[b.brand] = { count: 0, titles: [], discounts: [] };
    }
    brandGroup[b.brand].count += 1;
    brandGroup[b.brand].titles.push(b.title);
    brandGroup[b.brand].discounts.push(b.discount);
  });

  return Object.keys(brandGroup).map(brand => {
    const data = brandGroup[brand];
    const bannerShare = Number(((data.count / totalBanners) * 100).toFixed(1));
    const avgDiscount = data.discounts.length ? Math.round(data.discounts.reduce((a, b) => a + b, 0) / data.discounts.length) : 0;
    return {
      brand,
      bannerCount: data.count,
      bannerShare,
      currentPromotion: data.titles[0] || 'N/A',
      avgDiscount
    };
  }).sort((a, b) => b.bannerCount - a.bannerCount);
};

// 7. Search Visibility Analytics
const getSearchAnalytics = async (filters) => {
  const query = {};
  if (filters.brand) query.brand = filters.brand;
  if (filters.retailer) query.retailer = filters.retailer;
  if (filters.country) query.country = filters.country;

  const searchData = await SearchVisibility.aggregate([
    { $match: query },
    {
      $group: {
        _id: { keyword: '$keyword', brand: '$brand' },
        avgRanking: { $avg: '$ranking' },
        appearances: { $sum: 1 }
      }
    },
    {
      $project: {
        keyword: '$_id.keyword',
        brand: '$_id.brand',
        avgRanking: { $round: ['$avgRanking', 1] },
        appearances: 1,
        _id: 0
      }
    },
    { $sort: { keyword: 1, avgRanking: 1 } }
  ]);

  return searchData;
};

// 8. Historical Price Trend
const getPriceHistoryTrend = async (brand) => {
  const query = brand ? { brand } : {};
  const history = await PriceHistory.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          brand: '$brand',
          dateStr: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
        },
        avgPrice: { $avg: '$price' }
      }
    },
    {
      $project: {
        brand: '$_id.brand',
        date: '$_id.dateStr',
        avgPrice: { $round: ['$avgPrice', 0] },
        _id: 0
      }
    },
    { $sort: { date: 1 } }
  ]);

  return history;
};

// 9. Composite Brand Competitiveness Index Score (Nice to Have #4)
const getCompetitivenessAnalytics = async (filters) => {
  const [shelf, pricing, compliance, banners, search] = await Promise.all([
    getShareOfShelf(filters),
    getPricingAnalytics(filters),
    getComplianceAnalytics(filters),
    getBannerAnalytics(filters),
    getSearchAnalytics(filters)
  ]);

  const brands = ['Intel', 'AMD', 'Qualcomm', 'Apple'];
  
  const scores = brands.map(b => {
    const sItem = shelf.find(x => x.brand === b) || { percentage: 0 };
    const pItem = pricing.find(x => x.brand === b) || { avgDiscount: 0, avgPrice: 0 };
    const cItem = compliance.find(x => x.brand === b) || { complianceScore: 0 };
    const bItem = banners.find(x => x.brand === b) || { bannerShare: 0 };

    const bSearch = search.filter(x => x.brand === b);
    const avgRank = bSearch.length ? (bSearch.reduce((acc, curr) => acc + curr.avgRanking, 0) / bSearch.length) : 5;

    // Component ratings normalized out of 100
    const shelfRating = Math.min(100, sItem.percentage * 2.8);
    const promoRating = Math.min(100, pItem.avgDiscount * 4);
    const complianceRating = cItem.complianceScore || 0;
    const bannerRating = Math.min(100, bItem.bannerShare * 2.8);
    const searchRating = Math.max(10, Math.round(100 - (avgRank - 1) * 15));

    // Weighted roll-up: 25% Compliance + 25% Share of Shelf + 25% Promotion + 12.5% Banner + 12.5% Search
    const totalScore = Math.round(
      complianceRating * 0.25 +
      shelfRating * 0.25 +
      promoRating * 0.25 +
      bannerRating * 0.125 +
      searchRating * 0.125
    );

    return {
      brand: b,
      competitivenessScore: Math.min(99, Math.max(40, totalScore)),
      breakdown: {
        complianceScore: complianceRating,
        shareOfShelfPct: sItem.percentage || 0,
        avgDiscountPct: pItem.avgDiscount || 0,
        bannerSharePct: bItem.bannerShare || 0,
        searchAvgRank: Number(avgRank.toFixed(1))
      }
    };
  });

  return scores.sort((a, b) => b.competitivenessScore - a.competitivenessScore);
};

// 10. Real-time Anomaly & Alert Flags (Nice to Have #3)
const getAlertsAnalytics = async (filters) => {
  const query = buildFilterQuery(filters);
  const discountedProducts = await Product.find({ ...query, discount: { $gte: 18 } }).limit(4);
  const complianceData = await getComplianceAnalytics(filters);

  const alerts = [];

  // 1. Sharp Price Cut Alerts
  discountedProducts.forEach(p => {
    alerts.push({
      type: 'price_drop',
      severity: 'high',
      brand: p.brand,
      title: `Sharp Price Cut: ${p.brand} ${p.oem !== 'N/A' ? p.oem : ''} product marked down by ${p.discount}% on ${p.retailer}.`,
      sku: p.title,
      metric: `Price: $${p.price} (Orig: $${p.originalPrice})`,
      timestamp: 'Today'
    });
  });

  // 2. Compliance Gap Flags
  complianceData.forEach(c => {
    if (c.complianceScore < 85) {
      alerts.push({
        type: 'compliance_gap',
        severity: 'medium',
        brand: c.brand,
        title: `Listing Compliance Alert: ${c.brand} weighted compliance score dropped to ${c.complianceScore}%.`,
        sku: 'Multiple SKUs',
        metric: `S1-P5 Compliance: ${c.complianceScore}%`,
        timestamp: 'Today'
      });
    }
  });

  // 3. Banner Dominance Shift
  const bannerData = await getBannerAnalytics(filters);
  if (bannerData.length > 0) {
    const leader = bannerData[0];
    alerts.push({
      type: 'banner_shift',
      severity: 'info',
      brand: leader.brand,
      title: `Banner Dominance: ${leader.brand} captures ${leader.bannerShare}% of prime homepage banner space.`,
      sku: leader.currentPromotion,
      metric: `${leader.bannerCount} Homepage Banners`,
      timestamp: 'Today'
    });
  }

  return alerts;
};

module.exports = {
  getSummaryAnalytics,
  getShareOfShelf,
  getPricingAnalytics,
  getPromotionAnalytics,
  getComplianceAnalytics,
  getBannerAnalytics,
  getSearchAnalytics,
  getPriceHistoryTrend,
  getCompetitivenessAnalytics,
  getAlertsAnalytics
};

