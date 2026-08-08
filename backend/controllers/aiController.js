const asyncHandler = require('express-async-handler');
const analyticsService = require('../services/analyticsService');
const { queryGeminiAI } = require('../services/geminiService');

// @desc    Process AI user question with MongoDB data context
// @route   POST /api/ai/query
const processAIQuery = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    res.status(400);
    throw new Error('Please provide a valid question string.');
  }

  const qLower = question.toLowerCase();
  let contextData = {};

  if (qLower.includes('discount') || qLower.includes('promo') || qLower.includes('sale')) {
    const data = await analyticsService.getPromotionAnalytics({});
    contextData = { metric: 'average_discount', data };
  } else if (qLower.includes('shelf') || qLower.includes('share') || qLower.includes('catalog')) {
    const data = await analyticsService.getShareOfShelf({});
    contextData = { metric: 'share_of_shelf', data };
  } else if (qLower.includes('price') || qLower.includes('expensive') || qLower.includes('cheap') || qLower.includes('cost')) {
    const data = await analyticsService.getPricingAnalytics({});
    contextData = { metric: 'pricing', data };
  } else if (qLower.includes('compliance') || qLower.includes('audit') || qLower.includes('rubric') || qLower.includes('score')) {
    const data = await analyticsService.getComplianceAnalytics({});
    contextData = { metric: 'compliance', data };
  } else if (qLower.includes('banner')) {
    const data = await analyticsService.getBannerAnalytics({});
    contextData = { metric: 'banners', data };
  } else if (qLower.includes('search') || qLower.includes('rank') || qLower.includes('visibility')) {
    const data = await analyticsService.getSearchAnalytics({});
    contextData = { metric: 'search_visibility', data };
  } else {
    const summary = await analyticsService.getSummaryAnalytics({});
    const pricing = await analyticsService.getPricingAnalytics({});
    const shelf = await analyticsService.getShareOfShelf({});
    contextData = {
      metric: 'overview',
      data: { summary, pricing, shareOfShelf: shelf }
    };
  }

  const aiAnswer = await queryGeminiAI(question, contextData);

  res.json({
    question,
    contextMetric: contextData.metric,
    data: contextData.data,
    answer: aiAnswer
  });
});

module.exports = {
  processAIQuery
};
