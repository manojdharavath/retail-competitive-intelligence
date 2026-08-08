const asyncHandler = require('express-async-handler');
const analyticsService = require('../services/analyticsService');

const getSummary = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSummaryAnalytics(req.query);
  res.json(data);
});

const getShareOfShelf = asyncHandler(async (req, res) => {
  const data = await analyticsService.getShareOfShelf(req.query);
  res.json(data);
});

const getPricing = asyncHandler(async (req, res) => {
  const data = await analyticsService.getPricingAnalytics(req.query);
  res.json(data);
});

const getPromotions = asyncHandler(async (req, res) => {
  const data = await analyticsService.getPromotionAnalytics(req.query);
  res.json(data);
});

const getCompliance = asyncHandler(async (req, res) => {
  const data = await analyticsService.getComplianceAnalytics(req.query);
  res.json(data);
});

const getBanners = asyncHandler(async (req, res) => {
  const data = await analyticsService.getBannerAnalytics(req.query);
  res.json(data);
});

const getSearch = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSearchAnalytics(req.query);
  res.json(data);
});

const getHistoryTrend = asyncHandler(async (req, res) => {
  const data = await analyticsService.getPriceHistoryTrend(req.query.brand);
  res.json(data);
});

const getCompetitiveness = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCompetitivenessAnalytics(req.query);
  res.json(data);
});

const getAlerts = asyncHandler(async (req, res) => {
  const data = await analyticsService.getAlertsAnalytics(req.query);
  res.json(data);
});

module.exports = {
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
};

