import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Search, Download } from 'lucide-react';
import { exportToCSV } from '../utils/exportUtils';

const ProductTable = ({ products = [], loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.processor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.gpu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.oem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const exportable = filteredProducts.map(p => ({
      Title: p.title,
      Brand: p.brand,
      OEM: p.oem,
      Type: p.productType,
      Processor: p.processor,
      GPU: p.gpu,
      RAM: p.ram,
      Storage: p.storage,
      Price: p.price,
      Discount: `${p.discount}%`,
      Retailer: p.retailer,
      Country: p.country
    }));
    exportToCSV(exportable, 'sku_catalog_export.csv');
  };

  const getBrandBadge = (brand) => {
    switch (brand) {
      case 'Intel':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'AMD':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Qualcomm':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Apple':
        return 'bg-slate-200 text-slate-800 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKUs by title, CPU, GPU, or OEM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 font-medium"
          />
        </div>
        <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
          <span>Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> products</span>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold flex items-center space-x-1.5 border border-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>


      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">Product Title</th>
              <th className="py-3 px-3">Brand</th>
              <th className="py-3 px-3">OEM</th>
              <th className="py-3 px-3">Processor</th>
              <th className="py-3 px-3">GPU</th>
              <th className="py-3 px-3">RAM</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3">Discount</th>
              <th className="py-3 px-3">Retailer</th>
              <th className="py-3 px-3">Country</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            {loading ? (
              <tr>
                <td colSpan="11" className="py-8 text-center text-slate-500">
                  Loading product catalog...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="11" className="py-8 text-center text-slate-500">
                  No products found matching query.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 max-w-[220px] truncate font-semibold text-slate-900">
                    <Link to={`/products/${p._id}`} className="hover:text-blue-600 hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded border ${getBrandBadge(p.brand)}`}>
                      {p.brand}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{p.oem}</td>
                  <td className="py-3 px-3 text-slate-700 max-w-[140px] truncate">{p.processor || 'N/A'}</td>
                  <td className="py-3 px-3 text-slate-700 max-w-[120px] truncate">{p.gpu || 'N/A'}</td>
                  <td className="py-3 px-3 text-slate-700">{p.ram || 'N/A'}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">${p.price?.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    {p.discount > 0 ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                        -{p.discount}%
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-700">{p.retailer}</td>
                  <td className="py-3 px-3 text-slate-700">{p.country}</td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/products/${p._id}`}
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-semibold text-xs"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
