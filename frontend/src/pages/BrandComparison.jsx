import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import { 
  fetchPricing, 
  fetchShareOfShelf, 
  fetchCompliance, 
  fetchBanners, 
  fetchSearchVisibility,
  fetchCompetitiveness
} from '../services/api';
import { exportToCSV } from '../utils/exportUtils';
import { Download, Trophy } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const BrandComparison = () => {
  const [filters, setFilters] = useState({});
  const [comparisonMatrix, setComparisonMatrix] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMatrix = async () => {
    setLoading(true);
    try {
      const [pricing, shelf, compliance, banners, search, comp] = await Promise.all([
        fetchPricing(filters),
        fetchShareOfShelf(filters),
        fetchCompliance(filters),
        fetchBanners(filters),
        fetchSearchVisibility(filters),
        fetchCompetitiveness(filters)
      ]);

      const brands = ['Intel', 'AMD', 'Qualcomm', 'Apple'];
      
      const matrix = brands.map(brand => {
        const p = pricing.data.find(x => x.brand === brand) || {};
        const s = shelf.data.find(x => x.brand === brand) || {};
        const c = compliance.data.find(x => x.brand === brand) || {};
        const b = banners.data.find(x => x.brand === brand) || {};
        const compItem = comp.data.find(x => x.brand === brand) || {};
        
        // Avg Search Ranking
        const bSearch = search.data.filter(x => x.brand === brand);
        const avgRank = bSearch.length ? (bSearch.reduce((acc, curr) => acc + curr.avgRanking, 0) / bSearch.length).toFixed(1) : 'N/A';

        return {
          brand,
          competitivenessScore: compItem.competitivenessScore || 50,
          products: p.totalCount || 0,
          avgPrice: p.avgPrice || 0,
          avgDiscount: p.avgDiscount || 0,
          shareOfShelf: s.percentage || 0,
          complianceScore: c.complianceScore || 0,
          bannerShare: b.bannerShare || 0,
          searchRank: avgRank
        };
      });

      setComparisonMatrix(matrix);
    } catch (err) {
      console.error('Error loading brand comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatrix();
  }, [filters]);

  const handleExportCSV = () => {
    exportToCSV(comparisonMatrix, 'brand_benchmark_matrix.csv');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Multi-Brand Benchmark Matrix</h2>
          <p className="text-sm text-slate-500 mt-1">
            Side-by-side comparative analysis across Intel, AMD, Qualcomm, and Apple.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center space-x-2 transition shadow-sm"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Benchmark CSV</span>
        </button>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} onReset={() => setFilters({})} />

      {/* Main Benchmark Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Side-by-Side Competitive Matrix</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4 text-blue-700">Intel</th>
                <th className="py-3 px-4 text-red-700">AMD</th>
                <th className="py-3 px-4 text-indigo-700">Qualcomm</th>
                <th className="py-3 px-4 text-slate-700">Apple</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400">Loading benchmark matrix...</td>
                </tr>
              ) : (
                <>
                  <tr className="bg-amber-50/60 hover:bg-amber-100/50">
                    <td className="py-3.5 px-4 font-extrabold text-amber-900 flex items-center space-x-1.5">
                      <Trophy className="w-4 h-4 text-amber-600" />
                      <span>Competitiveness Score (0-100)</span>
                    </td>
                    {comparisonMatrix.map(m => (
                      <td key={m.brand} className="py-3.5 px-4 font-black text-amber-900 text-sm">
                        {m.competitivenessScore} / 100
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Total Products (SKUs)</td>
                    {comparisonMatrix.map(m => (
                      <td key={m.brand} className="py-3 px-4">{m.products} items</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Average List Price ($)</td>
                    {comparisonMatrix.map(m => (
                      <td key={m.brand} className="py-3 px-4">${m.avgPrice.toLocaleString()}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Average Discount (%)</td>
                    {comparisonMatrix.map(m => (
                      <td key={m.brand} className="py-3 px-4 text-emerald-600">{m.avgDiscount}%</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Share of Shelf (%)</td>
                    {comparisonMatrix.map(m => (
                      <td key={m.brand} className="py-3 px-4 text-blue-600">{m.shareOfShelf}%</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Listing Compliance Score (%)</td>
                    {comparisonMatrix.map(m => (
                      <td key={m.brand} className="py-3 px-4 text-purple-600">{m.complianceScore}%</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Homepage Banner Share (%)</td>
                    {comparisonMatrix.map(m => (
                      <td key={m.brand} className="py-3 px-4 text-amber-600">{m.bannerShare}%</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Search Visibility (Avg Rank)</td>
                    {comparisonMatrix.map(m => (
                      <td key={m.brand} className="py-3 px-4">#{m.searchRank}</td>
                    ))}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance vs Share of Shelf */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Share of Shelf vs Compliance Score</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonMatrix}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="brand" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="shareOfShelf" name="Share of Shelf (%)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="complianceScore" name="Compliance Score (%)" fill="#9333ea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price vs Discount */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Average Price ($) vs Average Discount (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonMatrix}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="brand" />
                <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
                <YAxis yAxisId="right" orientation="right" stroke="#16a34a" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="avgPrice" name="Avg Price ($)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="avgDiscount" name="Avg Discount (%)" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandComparison;

