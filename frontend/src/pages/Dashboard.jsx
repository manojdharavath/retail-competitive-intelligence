import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import MetricCard from '../components/MetricCard';
import { 
  fetchSummary, 
  fetchShareOfShelf, 
  fetchPricing, 
  fetchPromotions,
  fetchCompetitiveness,
  fetchAlerts
} from '../services/api';
import { 
  ShoppingBag, 
  DollarSign, 
  Percent, 
  PieChart as PieIcon, 
  CheckCircle2, 
  Tag, 
  Sparkles,
  Trophy,
  Bell,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

const BRAND_COLORS = {
  Intel: '#0068B5',
  AMD: '#ED1C24',
  Qualcomm: '#3253DC',
  Apple: '#475569'
};

const Dashboard = () => {
  const [filters, setFilters] = useState({});
  const [summary, setSummary] = useState(null);
  const [shelfData, setShelfData] = useState([]);
  const [pricingData, setPricingData] = useState([]);
  const [promoData, setPromoData] = useState([]);
  const [competitivenessData, setCompetitivenessData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sumRes, shelfRes, priceRes, promoRes, compRes, alertsRes] = await Promise.all([
        fetchSummary(filters),
        fetchShareOfShelf(filters),
        fetchPricing(filters),
        fetchPromotions(filters),
        fetchCompetitiveness(filters),
        fetchAlerts(filters)
      ]);
      setSummary(sumRes.data);
      setShelfData(shelfRes.data);
      setPricingData(priceRes.data);
      setPromoData(promoRes.data);
      setCompetitivenessData(compRes.data);
      setAlertsData(alertsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  const handleResetFilters = () => setFilters({});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Retail Competitive Intelligence</h2>
        <p className="text-sm text-slate-500 mt-1">
          Compare pricing, promotions, shelf visibility, and compliance across computing brands.
        </p>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} onReset={handleResetFilters} />

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Total Products"
          value={loading ? '...' : summary?.totalProducts || 0}
          subtext="Tracked SKUs"
          icon={ShoppingBag}
          color="blue"
        />
        <MetricCard
          title="Average Price"
          value={loading ? '...' : `$${summary?.avgPrice?.toLocaleString() || 0}`}
          subtext="Catalog Average"
          icon={DollarSign}
          color="emerald"
        />
        <MetricCard
          title="Avg Discount"
          value={loading ? '...' : `${summary?.avgDiscount || 0}%`}
          subtext="Promotional Markdown"
          icon={Percent}
          color="purple"
        />
        <MetricCard
          title="Share of Shelf Leader"
          value={loading ? '...' : summary?.shareOfShelfLeader || 'N/A'}
          subtext="Highest Catalog %"
          icon={PieIcon}
          color="indigo"
        />
        <MetricCard
          title="Compliance Leader"
          value={loading ? '...' : summary?.complianceLeader || 'N/A'}
          subtext="S1-S5 & P1-P5 Score"
          icon={CheckCircle2}
          color="amber"
        />
        <MetricCard
          title="Active Promotions"
          value={loading ? '...' : summary?.activePromotions || 0}
          subtext="Products on Sale"
          icon={Tag}
          color="rose"
        />
      </div>

      {/* Competitiveness Scorecard Leaderboard & Real-Time Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand Competitiveness Index Scorecard (Nice to Have #4) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-xl border border-indigo-900 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold">Composite Brand Competitiveness Index</h3>
            </div>
            <span className="text-xs bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded font-bold border border-amber-400/30">
              Rollup Score (0-100)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {competitivenessData.map((item, idx) => (
              <div key={item.brand} className="bg-white/10 p-3.5 rounded-lg border border-white/10 space-y-1.5 relative overflow-hidden">
                {idx === 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-bl">
                    #1 LEADER
                  </span>
                )}
                <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">{item.brand}</div>
                <div className="text-3xl font-black text-white">{item.competitivenessScore} <span className="text-xs font-normal text-slate-400">/100</span></div>
                <div className="text-[10px] text-slate-300 pt-1 border-t border-white/10 space-y-0.5">
                  <div>Shelf: {item.breakdown.shareOfShelfPct}%</div>
                  <div>Compliance: {item.breakdown.complianceScore}%</div>
                  <div>Discount: {item.breakdown.avgDiscountPct}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Alerts & Risk Flags Panel (Nice to Have #3) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">Real-Time Anomaly & Alerts</h3>
            </div>
            <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold border border-rose-200">
              {alertsData.length} Flags
            </span>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[190px] pr-1 text-xs">
            {loading ? (
              <div className="text-center py-6 text-slate-400">Loading alerts...</div>
            ) : alertsData.length === 0 ? (
              <div className="text-center py-6 text-slate-400">No active flags.</div>
            ) : (
              alertsData.map((alert, idx) => (
                <div key={idx} className={`p-2.5 rounded-lg border flex items-start space-x-2 ${
                  alert.severity === 'high' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                  alert.severity === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  'bg-blue-50 border-blue-200 text-blue-900'
                }`}>
                  {alert.severity === 'high' ? <Zap className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />}
                  <div className="space-y-0.5">
                    <div className="font-bold">{alert.title}</div>
                    <div className="text-[11px] opacity-80">{alert.metric}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 1: Share of Shelf & Price Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Share of Shelf Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Share of Shelf Distribution</h3>
              <p className="text-xs text-slate-500">Percentage of total catalog items belonging to each brand</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded font-semibold border border-blue-200">
              Core Metric
            </span>
          </div>

          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">Loading chart...</div>
            ) : shelfData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shelfData}
                    dataKey="productCount"
                    nameKey="brand"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={3}
                    label={({ brand, percentage }) => `${brand}: ${percentage}%`}
                  >
                    {shelfData.map((entry) => (
                      <Cell key={entry.brand} fill={BRAND_COLORS[entry.brand] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} SKUs (${props.payload.percentage}%)`, 'Share']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Brand vs Average Price Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Brand vs Average Price ($ USD)</h3>
              <p className="text-xs text-slate-500">Average list price comparison across tracked brands</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded font-semibold border border-emerald-200">
              Pricing Benchmark
            </span>
          </div>

          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">Loading chart...</div>
            ) : pricingData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pricingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="brand" tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Avg Price']} />
                  <Bar dataKey="avgPrice" radius={[6, 6, 0, 0]}>
                    {pricingData.map((entry) => (
                      <Cell key={entry.brand} fill={BRAND_COLORS[entry.brand] || '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Table: Promotion Comparison */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Promotional Benchmark Table</h3>
            <p className="text-xs text-slate-500">Discount depth and promotional volume per brand</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Average Discount</th>
                <th className="py-3 px-4">Discounted Products</th>
                <th className="py-3 px-4">Highest Discount</th>
                <th className="py-3 px-4">Total Products</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {promoData.map((row) => (
                <tr key={row.brand} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.brand}</td>
                  <td className="py-3 px-4 font-bold text-blue-600">{row.avgDiscount}%</td>
                  <td className="py-3 px-4 text-slate-700">{row.discountedProducts} items</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">-{row.maxDiscount}%</td>
                  <td className="py-3 px-4 text-slate-600">{row.totalProducts} items</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Key Insights */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-xl text-white shadow-lg space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold">Key Intelligence Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-200">
          {summary?.insights?.map((insight, idx) => (
            <div key={idx} className="bg-white/10 p-3 rounded-lg border border-white/10 flex items-start space-x-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

