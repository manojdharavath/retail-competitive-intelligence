const express = require('express');
const router = express.Router();
const {
  getSummary,
  getShareOfShelf,
  getPricing,
  getPromotions,
  getCompliance,
  getBanners,
  getSearch,
  getHistoryTrend,
  getCompetitiveness,
  getAlerts
} = require('../controllers/analyticsController');

router.get('/summary', getSummary);
router.get('/share-of-shelf', getShareOfShelf);
router.get('/pricing', getPricing);
router.get('/promotions', getPromotions);
router.get('/compliance', getCompliance);
router.get('/banners', getBanners);
router.get('/search', getSearch);
router.get('/history-trend', getHistoryTrend);
router.get('/competitiveness', getCompetitiveness);
router.get('/alerts', getAlerts);

module.exports = router;

