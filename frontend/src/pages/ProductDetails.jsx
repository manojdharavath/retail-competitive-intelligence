import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { ArrowLeft, CheckCircle, XCircle, ExternalLink, ShieldCheck, Tag, Cpu, HardDrive } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const ProductDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const res = await fetchProductById(id);
        setData(res.data);
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading SKU detail page...</div>;
  if (error || !data) return <div className="p-8 text-center text-red-500 font-semibold">{error || 'Product not found.'}</div>;

  const { product, priceHistory, audit } = data;

  const formattedHistory = priceHistory.map(h => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: h.price
  }));

  return (
    <div className="space-y-6">
      <Link to="/products" className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-600 hover:text-blue-800">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Product Catalog</span>
      </Link>

      {/* Main SKU Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded border border-blue-200">
                {product.brand}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded border border-slate-200">
                {product.oem}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded border border-purple-200">
                {product.productType}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">{product.title}</h2>
            <p className="text-xs text-slate-500">
              Retailer: <span className="font-semibold text-slate-800">{product.retailer}</span> ({product.country})
            </p>
          </div>

          <div className="text-right bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 uppercase font-bold">Active Listing Price</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-0.5">${product.price?.toLocaleString()}</div>
            {product.discount > 0 && (
              <div className="flex items-center justify-end space-x-2 mt-1">
                <span className="text-xs text-slate-400 line-through">${product.originalPrice?.toLocaleString()}</span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  -{product.discount}% OFF
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Badges Section */}
        {product.badges?.length > 0 && (
          <div className="pt-3 border-t border-slate-200 flex items-center space-x-2">
            <Tag className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Detected Badges:</span>
            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge, idx) => (
                <span key={idx} className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-900 rounded-md border border-amber-300">
                  🏷️ {badge}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Specifications & Retailer Audit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Full Specifications */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Technical Specifications</h3>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Processor (CPU)</span>
              <span className="font-semibold text-slate-900">{product.processor || 'N/A'}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Graphics (GPU)</span>
              <span className="font-semibold text-slate-900">{product.gpu || 'N/A'}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">RAM Memory</span>
              <span className="font-semibold text-slate-900">{product.ram || 'N/A'}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Storage Capacity</span>
              <span className="font-semibold text-slate-900">{product.storage || 'N/A'}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Retail Link</span>
              <a href={product.productUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold flex items-center space-x-1">
                <span>Open Listing</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Retailer Page Audit Compliance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Retailer Compliance Audit</h3>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full">
              Score: {audit?.auditScore || 0}%
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <AuditItem code="S1" title="Listing Title" desc="Title includes brand/processor name on search tile" pass={audit?.S1} />
            <AuditItem code="S2" title="Listing Badge" desc="Brand tier badge shown on search tile" pass={audit?.S2} />
            <AuditItem code="P1" title="Product Page Title" desc="Title includes brand/processor name on product page" pass={audit?.P1} />
            <AuditItem code="P2" title="Product Page Badge" desc="Brand tier badge shown on product page" pass={audit?.P2} />
            <AuditItem code="P3" title="Spec Table Mention" desc="Brand/processor specified in tech spec table" pass={audit?.P3} />
            <AuditItem code="P4" title="Brand Rich Media" desc="Brand-led A+ content present" pass={audit?.P4} />
            <AuditItem code="P5" title="OEM Rich Media" desc="OEM rich media (images/video) present" pass={audit?.P5} />
          </div>
        </div>
      </div>


      {/* Historical Price Trend Chart (Section 24) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Historical Price Trend (Last 30 Days)</h3>
          <p className="text-xs text-slate-500">Tracking price fluctuations over time for this specific SKU</p>
        </div>

        <div className="h-64">
          {formattedHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">No price history available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 50', 'dataMax + 50']} />
                <Tooltip formatter={(val) => [`$${val.toLocaleString()}`, 'Price']} />
                <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

const AuditItem = ({ code, title, desc, pass }) => (
  <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-200">
    <div className="space-y-0.5">
      <div className="flex items-center space-x-1.5 font-bold text-slate-800">
        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded border border-blue-200">{code}</span>
        <span>{title}</span>
      </div>
      <div className="text-[11px] text-slate-500">{desc}</div>
    </div>
    {pass ? (
      <span className="flex items-center space-x-1 text-emerald-600 font-bold px-2 py-1 bg-emerald-50 rounded border border-emerald-200 shrink-0">
        <CheckCircle className="w-4 h-4" />
        <span>PASS</span>
      </span>
    ) : (
      <span className="flex items-center space-x-1 text-rose-600 font-bold px-2 py-1 bg-rose-50 rounded border border-rose-200 shrink-0">
        <XCircle className="w-4 h-4" />
        <span>FAIL</span>
      </span>
    )}
  </div>
);

export default ProductDetails;

