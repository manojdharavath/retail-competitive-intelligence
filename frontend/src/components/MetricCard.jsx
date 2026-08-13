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
    <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden relative min-w-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-tight leading-snug break-words">
          {title}
        </p>
        {Icon && (
          <div className={`p-1.5 sm:p-2 rounded-lg border shrink-0 ${colorMap[color] || colorMap.blue}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2">
        <h3 className="text-base sm:text-lg xl:text-xl font-black text-slate-900 leading-tight break-words">
          {value}
        </h3>
        {subtext && (
          <p className="text-[11px] text-slate-500 mt-1 font-medium leading-snug break-words">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

