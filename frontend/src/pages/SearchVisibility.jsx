import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import { fetchSearchVisibility } from '../services/api';
import { Search, Trophy } from 'lucide-react';

const SearchVisibility = () => {
  const [filters, setFilters] = useState({});
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSearchVisibility = async () => {
    setLoading(true);
    try {
      const res = await fetchSearchVisibility(filters);
      setSearchData(res.data);
    } catch (err) {
      console.error('Error fetching search visibility:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSearchVisibility();
  }, [filters]);

  // Group data by keyword
  const keywordsMap = {};
  searchData.forEach(item => {
    if (!keywordsMap[item.keyword]) keywordsMap[item.keyword] = [];
    keywordsMap[item.keyword].push(item);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Share of Voice (Search Visibility)</h2>
        <p className="text-sm text-slate-500 mt-1">
          Search engine position and keyword surface rankings per brand across tracked retail platforms.
        </p>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} onReset={() => setFilters({})} />

      {/* Keywords Breakdown */}
      <div className="space-y-6">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-medium">Loading search visibility rankings...</div>
        ) : Object.keys(keywordsMap).length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium">No search data found for selected filters.</div>
        ) : (
          Object.entries(keywordsMap).map(([keyword, rankings]) => (
            <div key={keyword} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Target Keyword: <span className="text-blue-700 font-extrabold">"{keyword}"</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {rankings.map(item => (
                  <div key={item.brand} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase">{item.brand}</span>
                      <div className="text-2xl font-black text-slate-900 mt-0.5">#{item.avgRanking}</div>
                      <span className="text-[11px] text-slate-400">Avg Search Position</span>
                    </div>
                    {item.avgRanking <= 2 && (
                      <span className="p-2 bg-amber-100 text-amber-700 rounded-full">
                        <Trophy className="w-5 h-5" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchVisibility;
