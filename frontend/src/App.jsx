import React from 'react';
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
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
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
