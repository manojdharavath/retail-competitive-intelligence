import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});

export const fetchProducts = (params) => API.get('/products', { params });
export const fetchProductById = (id) => API.get(`/products/${id}`);

export const fetchSummary = (params) => API.get('/analytics/summary', { params });
export const fetchShareOfShelf = (params) => API.get('/analytics/share-of-shelf', { params });
export const fetchPricing = (params) => API.get('/analytics/pricing', { params });
export const fetchPromotions = (params) => API.get('/analytics/promotions', { params });
export const fetchCompliance = (params) => API.get('/analytics/compliance', { params });
export const fetchBanners = (params) => API.get('/analytics/banners', { params });
export const fetchSearchVisibility = (params) => API.get('/analytics/search', { params });
export const fetchPriceHistoryTrend = (brand) => API.get('/analytics/history-trend', { params: { brand } });
export const fetchCompetitiveness = (params) => API.get('/analytics/competitiveness', { params });
export const fetchAlerts = (params) => API.get('/analytics/alerts', { params });

export const queryAI = (question) => API.post('/ai/query', { question });

