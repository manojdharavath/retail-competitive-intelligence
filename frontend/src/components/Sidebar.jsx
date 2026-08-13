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
  Sparkles,
  X
} from 'lucide-react';

// Navigation items matching all 8 PDF requirements + AI Assistant
const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Products Catalog', path: '/products', icon: ShoppingBag },
  { name: 'Brand Comparison', path: '/brand-comparison', icon: Layers },
  { name: 'Pricing & Promotions', path: '/pricing-promotions', icon: Tag },
  { name: 'Compliance Audits', path: '/compliance', icon: CheckCircle2 },
  { name: 'Banner Tracking', path: '/banners', icon: Image },
  { name: 'Search Visibility', path: '/search-visibility', icon: Search },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Sparkles, badge: 'Gemini' }
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: Fixed on Desktop, Slide-over Drawer on Mobile */}
      <aside 
        className={`fixed lg:static top-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 min-h-screen lg:min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Header on Mobile with Close Button */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white tracking-wide">Navigation Menu</span>
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Analytics Dashboard
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
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
        </div>

        {/* Tracked Info Footer */}
        <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs mt-6">
          <p className="font-semibold text-slate-200">Tracked Retail Platforms</p>
          <p className="text-slate-400 mt-1 text-[11px]">Newegg (US) • Mercado Libre (Brazil)</p>
          <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>Brands: 4</span>
            <span>OEMs: 7</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

