import React from 'react';
import { ShieldCheck, Database, Cpu } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Retail Competitive Intelligence Dashboard
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                Bridge AI Prototype
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-brand benchmark: pricing, promotions, visibility, and compliance across Intel, AMD, Qualcomm, & Apple
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
            <Database className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">MongoDB Seeded Dataset</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span>Bridge AI Evaluation</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
