import React, { useState, useContext } from 'react';
import { AuthContext, api } from '../context/AuthContext';

function Dashboard() {
  const { user, setUser } = useContext(AuthContext); // Access global user context session
  const [brandName, setBrandName] = useState('');
  const [upgrading, setUpgrading] = useState(false);

  const [formData, setFormData] = useState({
    title: '', price: '', category: 'Acrylic & Resin', description: '', imageUrl: ''
  });

  const [steps, setSteps] = useState([
    { stepNumber: 1, title: 'Sanding & Prep', description: 'Preparing the canvas surface base texture' },
    { stepNumber: 2, title: 'Acrylic Layers', description: 'Applying detail color strokes and shading' },
    { stepNumber: 3, title: 'Resin Curing', description: 'Pouring high-gloss protective sealant coats' }
  ]);

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  // Core Upgrade Function Execution Handler
  const handleUpgradeAccount = async (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setUpgrading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      // Hits your backend authController.upgradeToSeller controller pipeline
      const response = await api.put('/auth/upgrade-seller', { brandName });
      
      // Update the global session context local state with new server security role values
      if (user) {
        setUser({ ...user, role: response.data.user.role });
      }
      setStatusMessage({ type: 'success', text: '🎉 Account upgraded! Welcome to the LUDO Creative Guild.' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Upgrade sequence declined by server.' });
    } finally {
      setUpgrading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    setSteps(updatedSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });
    setSubmitting(true);

    // Fallback default image array layout if none is explicitly specified
    const finalImageUrl = formData.imageUrl.trim() 
      ? [formData.imageUrl.trim()] 
      : ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600'];

    // Map your payload elements to sync with the Mongoose model schema keys
    const payload = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      mediaType: formData.category, // <-- Remapped from 'category' to 'mediaType'
      images: finalImageUrl,        // <-- Remapped from 'imageUrl' string to 'images' array
      stock: 1,
      productionSteps: steps        // <-- Explicitly attached effort verification array
    };

    try {
      // Post cleanly straight down into your controller endpoint router
      await api.post('/products', payload);
      
      setStatusMessage({ type: 'success', text: '🎉 Artwork deployed successfully directly to the global marketplace feed!' });
      // Reset text fields
      setFormData({ title: '', price: '', category: 'Acrylic & Resin', description: '', imageUrl: '' });
    } catch (err) {
      setStatusMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error creating product listing. Check backend console logs.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // SCREEN A: RENDER LOCK IF USER IS A BUYER
  if (!user || user.role === 'buyer') {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white border border-gray-100 rounded-xl shadow-sm animate-fadeIn text-xs">
        <div className="text-center mb-6">
          <span className="text-3xl">🎨</span>
          <h2 className="text-xl font-black text-[#121212] mt-3 tracking-tight">Open Your Creative Studio</h2>
          <p className="text-gray-400 mt-1">Upgrade your profile to mint artisan records and list products</p>
        </div>

        {statusMessage.text && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-900 rounded-lg font-medium">
            ⚠️ {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleUpgradeAccount} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Creative Studio / Brand Name</label>
            <input 
              type="text" required value={brandName} onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g., WiggleNWow Hub"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#121212] font-medium text-sm"
            />
          </div>

          <button 
            type="submit" disabled={upgrading}
            className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm shadow-sm"
          >
            {upgrading ? "Provisioning Developer Credentials..." : "Activate Seller Workspace"}
          </button>
        </form>
      </div>
    );
  }

  // SCREEN B: RENDER FULL CREATOR WORKSPACE IF SECURITY ROLE IS SELLER/ARTIST
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#121212]">Studio Workspace</h1>
        <p className="text-gray-400 text-xs mt-1">Deploy new custom masterpieces and track your creative steps</p>
      </div>

      {statusMessage.text && (
        <div className={`p-4 rounded-xl border text-xs font-semibold ${
          statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-rose-50 border-rose-100 text-rose-900'
        }`}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="md:col-span-1 bg-white border border-gray-100 p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold border-b border-gray-50 pb-2 text-[#121212]">Asset Metadata</h3>
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Masterpiece Title</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g., Textured Guitar Painting" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#121212] font-medium text-sm" />
          </div>
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Listing Price (INR ₹)</label>
            <input type="number" name="price" required value={formData.price} onChange={handleChange} placeholder="12500" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#121212] font-medium text-sm" />
          </div>
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Medium Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#121212] font-medium text-sm cursor-pointer">
              <option value="Watercolor">Watercolor</option>
              <option value="Acrylic & Resin">Acrylic & Resin</option>
              <option value="Charcoal">Charcoal</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Showcase Image URL</label>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Paste image address link" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#121212] font-medium text-sm" />
          </div>
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Process Overview / Story</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Detail the creative history underlying this item..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#121212] font-medium text-sm resize-none" />
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold border-b border-gray-50 pb-2 text-[#121212]">⌛ Behind the Craft: Effort & Trust Breakdown Phases</h3>
            {steps.map((step, index) => (
              <div key={step.stepNumber} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                <span className="font-bold text-indigo-600">Phase 0{step.stepNumber}</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input type="text" required value={step.title} onChange={(e) => handleStepChange(index, 'title', e.target.value)} className="sm:col-span-1 bg-white border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-[#121212] font-semibold text-sm" />
                  <input type="text" required value={step.description} onChange={(e) => handleStepChange(index, 'description', e.target.value)} className="sm:col-span-2 bg-white border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-[#121212] text-sm" />
                </div>
              </div>
            ))}
          </div>
          <button type="submit" disabled={submitting} className="w-full py-3 mt-6 bg-[#121212] text-white font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm shadow-sm">
            {submitting ? 'Minting Creative Record Asset...' : 'Deploy Artwork to Global Feed'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Dashboard;