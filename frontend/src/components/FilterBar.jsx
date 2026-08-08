import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-2 text-slate-700 font-semibold text-sm shrink-0">
        <Filter className="w-4 h-4 text-blue-600" />
        <span>Filter Data:</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Brand */}
        <select
          name="brand"
          value={filters.brand || ''}
          onChange={handleChange}
          className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 font-medium"
        >
          <option value="">All Brands</option>
          <option value="Intel">Intel</option>
          <option value="AMD">AMD</option>
          <option value="Qualcomm">Qualcomm</option>
          <option value="Apple">Apple</option>
        </select>

        {/* OEM */}
        <select
          name="oem"
          value={filters.oem || ''}
          onChange={handleChange}
          className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 font-medium"
        >
          <option value="">All OEMs</option>
          <option value="Dell">Dell</option>
          <option value="HP">HP</option>
          <option value="Lenovo">Lenovo</option>
          <option value="Acer">Acer</option>
          <option value="Asus">Asus</option>
          <option value="MSI">MSI</option>
          <option value="Apple">Apple</option>
        </select>

        {/* Product Type */}
        <select
          name="productType"
          value={filters.productType || ''}
          onChange={handleChange}
          className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 font-medium"
        >
          <option value="">All Product Types</option>
          <option value="Notebook">Notebook</option>
          <option value="Desktop">Desktop</option>
          <option value="Workstation">Workstation</option>
          <option value="Tablet">Tablet</option>
          <option value="CPU/GPU component">CPU/GPU Component</option>
        </select>

        {/* Retailer */}
        <select
          name="retailer"
          value={filters.retailer || ''}
          onChange={handleChange}
          className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 font-medium"
        >
          <option value="">All Retailers</option>
          <option value="Newegg">Newegg</option>
          <option value="Mercado Libre">Mercado Libre</option>
        </select>

        {/* Country */}
        <select
          name="country"
          value={filters.country || ''}
          onChange={handleChange}
          className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 font-medium"
        >
          <option value="">All Countries</option>
          <option value="US">US</option>
          <option value="Brazil">Brazil</option>
        </select>
      </div>

      <button
        onClick={onReset}
        className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg font-medium transition"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
};

export default FilterBar;
