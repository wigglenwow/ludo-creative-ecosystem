import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate(); // Added for dynamic view state redirection
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        
        if (response.data && response.data.product) {
          setProduct(response.data.product);
        } else if (response.data) {
          setProduct(response.data);
        } else {
          setError('Invalid data structural response layout.');
        }
      } catch (err) {
        console.error("Fetch details error log:", err);
        setError(err.response?.data?.message || 'Could not locate this masterpiece asset record.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // 🚀 NEW LOGIC: Spawns or restores a secure backend chat stream channel loop
  const handleNegotiateClick = async () => {
    if (!product) return;
    setActionLoading(true);
    try {
      const response = await api.post('/chat', {
        sellerId: product.seller?._id || product.seller, // Fallback safe id check
        productId: product._id
      });

      if (response.data && response.data.chat) {
        // Redirect the buyer directly to the messages view pane, passing the active room layout context
        navigate('/messages', { state: { activeChatId: response.data.chat._id } });
      }
    } catch (err) {
      console.error("Error opening communication terminal:", err);
      alert(err.response?.data?.message || "Could not open a private negotiation line at this moment.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-24 text-xs font-semibold text-gray-400 animate-pulse">
        Gathering master craft telemetry data...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto mt-24 text-center p-6 bg-rose-50 border border-rose-100 rounded-xl text-rose-900 text-xs font-semibold">
        ⚠️ {error || 'Masterpiece listing not found.'}
        <div className="mt-4">
          <Link to="/" className="text-indigo-600 hover:underline">Return to Main Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn text-xs">
      {/* Back Navigation Links */}
      <div className="flex items-center space-x-2 text-gray-400 font-medium">
        <Link to="/" className="hover:text-[#121212] transition-colors">Marketplace Catalog</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[200px]">{product.title}</span>
      </div>

      {/* Main Showcase Layout Split Screen Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Premium Media Display */}
        <div className="bg-white border border-gray-100 p-2 rounded-2xl shadow-sm">
          <img 
            src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600'} 
            alt={product.title}
            className="w-full h-[400px] object-cover rounded-xl"
          />
        </div>

        {/* Right Column: Asset Details & Negotiation CTA */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 font-bold rounded-md uppercase tracking-wider text-[10px]">
              {product.mediaType || 'Fine Art Asset'}
            </span>
            <h1 className="text-3xl font-black text-[#121212] tracking-tight mt-1">{product.title}</h1>
            
            <p className="text-gray-400 font-medium">
              Curated by: <span className="text-indigo-600 font-bold hover:underline cursor-pointer">@{product.seller?.sellerDetails?.brandName || product.seller?.name || 'Verified Creator'}</span>
            </p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Investment Price Valuation</p>
            <p className="text-2xl font-black text-[#121212] mt-1">₹{product.price}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#121212]">The Backstory / Creative Narrative</h3>
            <p className="text-gray-600 leading-relaxed font-medium text-sm bg-white p-4 border border-gray-100 rounded-xl shadow-xs">
              {product.description}
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 py-3 bg-[#121212] text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm text-sm">
              Acquire Original Work
            </button>
            
            {/* 🛠️ INTEGRATED EVENT HANDLER BUTTON LINKED DIRECTLY TO CHAT ENGINE CONNECTIONS */}
            <button 
              onClick={handleNegotiateClick}
              disabled={actionLoading}
              className="px-5 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {actionLoading ? 'Initializing Room...' : '💬 Negotiate Commission'}
            </button>
          </div>
        </div>
      </div>

      <hr className="border-gray-100 my-8" />

      {/* Bottom Row: Behind the Craft Trust Blueprint */}
      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-black text-[#121212] tracking-tight">⌛ Behind the Craft: Effort Validation Blueprint</h3>
          <p className="text-gray-400 mt-0.5">Transparent production phase logging proving creative integrity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {(product.productionSteps && product.productionSteps.length > 0 ? product.productionSteps : [
            { stepNumber: 1, title: 'Surface Setup & Sanding', description: 'Preparing canvas base profile guidelines.' },
            { stepNumber: 2, title: 'Medium Base Pigments', description: 'Layering active chroma values and texture blockouts.' },
            { stepNumber: 3, title: 'Curing & High-Gloss Seal', description: 'Applying protective finishing isolation coats.' }
          ]).map((step) => (
            <div key={step.stepNumber} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <span className="font-extrabold text-indigo-600 text-[10px] tracking-widest uppercase">Phase 0{step.stepNumber}</span>
              <h4 className="font-bold text-gray-800 text-sm">{step.title}</h4>
              <p className="text-gray-500 font-medium leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;