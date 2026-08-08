import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Tag, 
  CheckCircle2, 
  Image, 
  Search, 
  Sparkles 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: ShoppingBag },
  { name: 'Brand Comparison', path: '/brand-comparison', icon: Layers },
  { name: 'Pricing & Promotions', path: '/pricing-promotions', icon: Tag },
  { name: 'Compliance', path: '/compliance', icon: CheckCircle2 },
  { name: 'Banners', path: '/banners', icon: Image },
  { name: 'Search Visibility', path: '/search-visibility', icon: Search },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Sparkles, badge: 'Gemini' }
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
        <p className="font-semibold text-slate-200">Tracked Platforms</p>
        <p className="text-slate-400 mt-1">Newegg (US) • Mercado Libre (Brazil)</p>
        <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Brands: 4</span>
          <span>OEMs: 7</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
