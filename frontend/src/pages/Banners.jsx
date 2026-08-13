import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import { fetchBanners } from '../services/api';
import { Image, Tag, Award } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const BRAND_COLORS = {
  Intel: '#0068B5',
  AMD: '#ED1C24',
  Qualcomm: '#9333EA', // Distinct Vibrant Purple
  Apple: '#475569'
};

const Banners = () => {
  const [filters, setFilters] = useState({});
  const [bannerData, setBannerData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await fetchBanners(filters);
      setBannerData(res.data);
    } catch (err) {
      console.error('Error fetching banner analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Homepage Banner Tracking</h2>
        <p className="text-sm text-slate-500 mt-1">
          Daily monitoring of prime retail real estate: homepage banner counts, share of voice, and featured promotions.
        </p>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} onReset={() => setFilters({})} />

      {/* Grid: Pie Chart & Summary Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banner Share Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Homepage Banner Share (%)</h3>
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded font-semibold border border-purple-200">
              Prime Visibility
            </span>
          </div>

          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">Loading chart...</div>
            ) : bannerData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">No banner data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bannerData}
                    dataKey="bannerCount"
                    nameKey="brand"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={40}
                    paddingAngle={4}
                    label={({ brand, bannerShare }) => `${brand}: ${bannerShare}%`}
                  >
                    {bannerData.map((entry) => (
                      <Cell key={entry.brand} fill={BRAND_COLORS[entry.brand] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name, props) => [`${val} Banners (${props.payload.bannerShare}%)`, 'Banners']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Banner Details Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Brand Banner Summary</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <th className="py-3 px-3">Brand</th>
                  <th className="py-3 px-3">Banner Count</th>
                  <th className="py-3 px-3">Banner Share</th>
                  <th className="py-3 px-3">Featured Campaign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-slate-400">Loading table...</td>
                  </tr>
                ) : (
                  bannerData.map((row) => (
                    <tr key={row.brand} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{row.brand}</td>
                      <td className="py-3 px-3 font-bold text-blue-600">{row.bannerCount} banners</td>
                      <td className="py-3 px-3 font-bold text-emerald-600">{row.bannerShare}%</td>
                      <td className="py-3 px-3 text-slate-700 max-w-[200px] truncate" title={row.currentPromotion}>
                        {row.currentPromotion}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banners;
