import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import BrandComparison from './pages/BrandComparison';
import PricingPromotions from './pages/PricingPromotions';
import Compliance from './pages/Compliance';
import Banners from './pages/Banners';
import SearchVisibility from './pages/SearchVisibility';
import AIAssistant from './pages/AIAssistant';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/brand-comparison" element={<BrandComparison />} />
            <Route path="/pricing-promotions" element={<PricingPromotions />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/search-visibility" element={<SearchVisibility />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

