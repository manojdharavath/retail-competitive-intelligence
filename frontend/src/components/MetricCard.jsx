import React from 'react';

const MetricCard = ({ title, value, subtext, icon: Icon, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200'
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{value}</h3>
        {subtext && <p className="text-xs text-slate-500 mt-1 font-medium">{subtext}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-lg border ${colorMap[color] || colorMap.blue}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default MetricCard;
