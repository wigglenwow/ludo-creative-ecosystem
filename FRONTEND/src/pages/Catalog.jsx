import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../context/AuthContext';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch all live masterworks from your database cluster on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        // Handle array formats safely depending on your exact controller return structure
        const productData = Array.isArray(response.data) ? response.data : response.data.products || [];
        setProducts(productData);
      } catch (err) {
        setError('Unable to fetch live marketplace catalog data streams.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products locally by medium category matching the navigation pills
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.mediaType === selectedCategory);

  if (loading) {
    return (
      <div className="text-center mt-24 text-xs font-semibold text-gray-400 animate-pulse">
        Synchronizing decentralized marketplace assets...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-xs">
      
      {/* Catalog Title Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#121212]">LUDO Catalog</h1>
          <p className="text-gray-400 font-medium mt-1">Direct original works and customized artisan commissions.</p>
        </div>

        {/* Category Navigation Selection Filter Pills */}
        <div className="flex flex-wrap gap-2 font-semibold">
          {['All', 'Watercolor', 'Acrylic & Resin', 'Charcoal'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedCategory === category
                  ? 'bg-[#121212] border-[#121212] text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-900 font-semibold rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {/* Dynamic Product Grid Interface Layout */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl bg-white text-gray-400 font-medium">
          No masterpieces found listed under the "{selectedCategory}" medium profile category filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product._id} 
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Visual Image Media Canvas */}
                <div className="w-full h-48 bg-gray-50 rounded-xl overflow-hidden relative">
                  <img 
                    src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600'} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-xs text-gray-800 rounded-md font-bold text-[9px] uppercase tracking-wider shadow-xs">
                    {product.mediaType || 'Fine Art'}
                  </span>
                </div>

                {/* Title Descriptor Header */}
                <div>
                  <h3 className="font-black text-sm text-[#121212] line-clamp-1 tracking-tight">
                    {product.title}
                  </h3>
                  <p className="text-gray-400 mt-0.5 line-clamp-2 font-medium leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Pricing Metric Grid Split Bar */}
              <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-auto">
                <div className="flex flex-col">
                  <span className="text-gray-400 font-bold text-[9px] tracking-wider uppercase">Value</span>
                  <span className="font-black text-sm text-[#121212]">₹{product.price}</span>
                </div>
                
                {/* 🚀 THE DYNAMIC ROUTER LINK CONNECTION OVERLAY IS MOUNTED HERE */}
                <Link 
                  to={`/product/${product._id}`} 
                  className="px-4 py-2 bg-[#121212] text-white font-bold rounded-lg text-center hover:bg-gray-800 transition-colors"
                >
                  View Details
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Catalog;