import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import ProductTable from '../components/ProductTable';
import { fetchProducts } from '../services/api';

const Products = () => {
  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchProducts(filters);
      setProducts(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">SKU Explorer & Product Catalog</h2>
        <p className="text-sm text-slate-500 mt-1">
          Search, filter, and inspect detailed product attributes across tracked computing brands.
        </p>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} onReset={() => setFilters({})} />

      <ProductTable products={products} loading={loading} />
    </div>
  );
};

export default Products;
