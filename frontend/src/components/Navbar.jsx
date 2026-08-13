import React from 'react';
import { Menu } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Retail Competitive Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Multi-Brand Benchmark: Intel • AMD • Qualcomm • Apple
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <span>Tracked Platforms: Newegg (US) & Mercado Libre (Brazil)</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


