import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import { fetchCompliance } from '../services/api';
import { ShieldCheck, Check, X, Info } from 'lucide-react';

const BADGE_DEFINITIONS = {
  Intel: ['Core', 'Core Ultra', 'Evo', 'vPro'],
  AMD: ['Ryzen', 'Ryzen AI'],
  Qualcomm: ['Snapdragon', 'Copilot+ PC'],
  Apple: ['Apple Silicon', 'M-series']
};

const RUBRIC_EXPLANATIONS = {
  S1: { code: 'S1', label: 'Listing Title', desc: 'Listing page title includes brand/processor name' },
  S2: { code: 'S2', label: 'Listing Badge', desc: 'Listing tile displays brand tier badge' },
  P1: { code: 'P1', label: 'Product Title', desc: 'Product page title includes brand/processor name' },
  P2: { code: 'P2', label: 'Product Badge', desc: 'Product page displays brand tier badge' },
  P3: { code: 'P3', label: 'Spec Table', desc: 'Brand/processor mentioned in tech specs table' },
  P4: { code: 'P4', label: 'Brand Rich Media', desc: 'Brand-led rich media / A+ content present' },
  P5: { code: 'P5', label: 'OEM Rich Media', desc: 'OEM rich media (images/videos) present' }
};

const Compliance = () => {
  const [filters, setFilters] = useState({});
  const [complianceData, setComplianceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCompliance = async () => {
    setLoading(true);
    try {
      const res = await fetchCompliance(filters);
      setComplianceData(res.data);
    } catch (err) {
      console.error('Error fetching compliance analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompliance();
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Retailer Compliance & Badge Audits</h2>
        <p className="text-sm text-slate-500 mt-1">
          Evaluate listing & product page accuracy scored against Bridge AI's 7-point audit rubric.
        </p>
      </div>

      {/* Brief Weighting Banner */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start space-x-3 text-xs text-blue-900">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Bridge AI Weighting Methodology: </span>
          Overall Brand Compliance Score rolls up listing (S1-S2) and product page (P1-P5) audits per brand, weighted <span className="font-extrabold text-blue-700">85% Notebook</span> and <span className="font-extrabold text-blue-700">15% Desktop</span>.
        </div>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} onReset={() => setFilters({})} />

      {/* Brand Compliance Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {complianceData.map((item) => (
          <div key={item.brand} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">{item.brand}</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{item.complianceScore}%</div>
            <p className="text-xs text-slate-500 font-medium">Weighted Listing Score ({item.auditCount} SKUs)</p>
          </div>
        ))}
      </div>

      {/* Rubric Legend */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
        <div className="font-bold text-slate-800 text-sm">📋 7-Point Retail Audit Rubric Legend</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-slate-600">
          {Object.entries(RUBRIC_EXPLANATIONS).map(([code, item]) => (
            <div key={code} className="bg-white p-2 rounded border border-slate-200">
              <span className="font-bold text-blue-600 mr-1.5">[{code}]</span>
              <span className="font-bold text-slate-800">{item.label}: </span>
              <span className="text-[11px] text-slate-500">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rubric Breakdown Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">7-Point Audit Checklist Breakdown</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-3 text-center">Compliance Score</th>
                {Object.entries(RUBRIC_EXPLANATIONS).map(([code, item]) => (
                  <th key={code} className="py-3 px-3 text-center" title={item.desc}>
                    <div className="font-extrabold text-slate-800">{item.label}</div>
                    <div className="text-[10px] text-blue-600 font-bold">({code})</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-6 text-center text-slate-400">Loading compliance data...</td>
                </tr>
              ) : (
                complianceData.map((row) => (
                  <tr key={row.brand} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.brand}</td>
                    <td className="py-3 px-3 text-center font-extrabold text-blue-700">{row.complianceScore}%</td>
                    {Object.keys(RUBRIC_EXPLANATIONS).map(code => {
                      const pass = row.checks[code];
                      return (
                        <td key={code} className="py-3 px-3 text-center">
                          {pass ? (
                            <span className="inline-flex items-center justify-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                              ✓ PASS
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center px-2 py-1 bg-rose-100 text-rose-800 rounded font-bold text-[11px]">
                              ✕ FAIL
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Detected Brand Badges Grid (Section 17) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Tracked Tier & Certification Badges</h3>
        <p className="text-xs text-slate-500">Official brand badges monitored across retailer listing tiles and product pages</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(BADGE_DEFINITIONS).map(([brand, badges]) => (
            <div key={brand} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">{brand} Badges</h4>
              <div className="flex flex-wrap gap-1.5">
                {badges.map(badge => (
                  <span key={badge} className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-900 rounded border border-amber-300">
                    🏷️ {badge}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Compliance;
