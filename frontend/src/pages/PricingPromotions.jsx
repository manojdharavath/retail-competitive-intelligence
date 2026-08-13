import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import MetricCard from '../components/MetricCard';
import { 
  fetchPricing, 
  fetchPromotions, 
  fetchProducts, 
  fetchPriceHistoryTrend 
} from '../services/api';
import { exportToCSV } from '../utils/exportUtils';
import { DollarSign, Tag, TrendingDown, Percent, Download, ExternalLink, Flame, ShieldAlert } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  Cell 
} from 'recharts';

const BRAND_COLORS = {
  Intel: '#0068B5',
  AMD: '#ED1C24',
  Qualcomm: '#9333EA', // Distinct Vibrant Purple
  Apple: '#475569'
};

const PricingPromotions = () => {
  const [filters, setFilters] = useState({});
  const [pricingData, setPricingData] = useState([]);
  const [promoData, setPromoData] = useState([]);
  const [discountedSkus, setDiscountedSkus] = useState([]);
  const [priceHistoryData, setPriceHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [priceRes, promoRes, prodRes, historyRes] = await Promise.all([
        fetchPricing(filters),
        fetchPromotions(filters),
        fetchProducts({ ...filters, sort: 'discount_desc' }),
        fetchPriceHistoryTrend()
      ]);
      setPricingData(priceRes.data);
      setPromoData(promoRes.data);
      setDiscountedSkus(prodRes.data.filter(p => p.discount > 0));

      // Format history trend by date & brand
      const historyMap = {};
      historyRes.data.forEach(h => {
        if (!historyMap[h.date]) historyMap[h.date] = { date: h.date };
        historyMap[h.date][h.brand] = h.avgPrice;
      });
      setPriceHistoryData(Object.values(historyMap));
    } catch (err) {
      console.error('Error fetching pricing & promotions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleExportCSV = () => {
    const exportable = discountedSkus.map(p => ({
      Title: p.title,
      Brand: p.brand,
      OEM: p.oem,
      Retailer: p.retailer,
      Country: p.country,
      'Active Price': `$${p.price}`,
      'Original Price': `$${p.originalPrice}`,
      'Discount %': `${p.discount}%`,
      'Savings ($)': `$${p.originalPrice - p.price}`
    }));
    exportToCSV(exportable, 'promotional_deals_export.csv');
  };

  const topDiscountBrand = promoData.length ? [...promoData].sort((a, b) => b.avgDiscount - a.avgDiscount)[0]?.brand : 'N/A';
  const totalDiscountedCount = promoData.reduce((acc, curr) => acc + (curr.discountedProducts || 0), 0);
  const totalSavingsUsd = discountedSkus.reduce((acc, curr) => acc + (curr.originalPrice - curr.price), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Pricing & Promotional Intelligence</h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time multi-platform price point comparisons, discount depth, price elasticity spectrum, and flash sale monitoring.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center space-x-2 transition shadow-sm"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export On-Sale Deals CSV</span>
        </button>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} onReset={() => setFilters({})} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Discount Leader"
          value={loading ? '...' : topDiscountBrand}
          subtext="Highest Average Discount Depth"
          icon={Percent}
          color="purple"
        />
        <MetricCard
          title="On-Sale Volume"
          value={loading ? '...' : `${totalDiscountedCount} SKUs`}
          subtext="Products Currently Discounted"
          icon={Tag}
          color="rose"
        />
        <MetricCard
          title="Total Buyer Savings"
          value={loading ? '...' : `$${totalSavingsUsd.toLocaleString()}`}
          subtext="Cumulative Promotional Value"
          icon={Flame}
          color="emerald"
        />
        <MetricCard
          title="Max Markdown"
          value={loading ? '...' : `-${Math.max(...promoData.map(p => p.maxDiscount || 0), 0)}%`}
          subtext="Deepest Single Price Cut"
          icon={TrendingDown}
          color="amber"
        />
      </div>

      {/* Charts Row 1: Average Price & Price Spectrum */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Range Spectrum Chart (Min, Avg, Max Price) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Brand Price Range Spectrum ($ USD)</h3>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">Min / Avg / Max</span>
          </div>
          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pricingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="brand" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Price']} />
                  <Legend />
                  <Bar dataKey="minPrice" name="Min Price ($)" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgPrice" name="Avg Price ($)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="maxPrice" name="Max Price ($)" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Discount Depth Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Average Discount Depth (%) & On-Sale Volume</h3>
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold border border-purple-200">Promotions</span>
          </div>
          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={promoData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="brand" />
                  <YAxis yAxisId="left" orientation="left" stroke="#9333ea" />
                  <YAxis yAxisId="right" orientation="right" stroke="#2563eb" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="avgDiscount" name="Avg Discount (%)" fill="#9333ea" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="discountedProducts" name="Discounted SKUs" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Historical Market Price Trend Chart (Last 30 Days) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">30-Day Historical Price Trends per Brand</h3>
          <p className="text-xs text-slate-500">Tracking daily price cuts and flash sale windows over the last 30 days</p>
        </div>

        <div className="h-72">
          {loading ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">Loading trend history...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`$${value?.toLocaleString() || 0}`, 'Price']} />
                <Legend />
                <Line type="monotone" dataKey="Intel" stroke="#0068B5" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="AMD" stroke="#ED1C24" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Qualcomm" stroke="#3253DC" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Apple" stroke="#475569" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Discounted Deals Catalog Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Promotional Deals & Price Cuts</h3>
            <p className="text-xs text-slate-500">Live products currently on markdown across Newegg and Mercado Libre</p>
          </div>
          <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">
            {discountedSkus.length} Active Deals
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                <th className="py-3 px-4">Product Title</th>
                <th className="py-3 px-3">Brand</th>
                <th className="py-3 px-3">OEM</th>
                <th className="py-3 px-3">Current Price</th>
                <th className="py-3 px-3">Original Price</th>
                <th className="py-3 px-3">Discount Depth</th>
                <th className="py-3 px-3">Consumer Savings</th>
                <th className="py-3 px-3">Retailer</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-6 text-center text-slate-400">Loading promotional deals...</td>
                </tr>
              ) : discountedSkus.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-6 text-center text-slate-400">No active promotional deals matching filter.</td>
                </tr>
              ) : (
                discountedSkus.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-[240px] truncate">{p.title}</td>
                    <td className="py-3 px-3 font-bold text-blue-700">{p.brand}</td>
                    <td className="py-3 px-3 text-slate-600">{p.oem}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">${p.price?.toLocaleString()}</td>
                    <td className="py-3 px-3 text-slate-400 line-through">${p.originalPrice?.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                        -{p.discount}% OFF
                      </span>
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">
                      Save ${(p.originalPrice - p.price)?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-700">{p.retailer} ({p.country})</td>
                    <td className="py-3 px-3 text-right">
                      <a href={p.productUrl} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-blue-600 hover:underline font-bold">
                        <span>View Deal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PricingPromotions;

