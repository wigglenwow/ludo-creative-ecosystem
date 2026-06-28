import React, { useState } from 'react';

function HandworkCard() {
  // Simple state to let the user toggle a detail view
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="w-full max-w-md bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      
      {/* Header section explaining the mission */}
      <div className="flex items-center space-x-2 text-amber-700 font-semibold text-xs uppercase tracking-wider mb-3">
        <span>⏳ Behind the Craft</span>
      </div>

      <h3 className="text-lg font-bold text-[#121212] mb-1">
        Custom Textured Acrylic Guitar
      </h3>
      <p className="text-gray-500 text-xs mb-4">
        Created by <span className="font-semibold text-gray-700">Test Artist</span>
      </p>

      {/* Simplified visual horizontal step graphic */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium text-gray-600 mb-4">
        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <div className="text-sm mb-0.5">🪵</div>
          <span className="block text-[10px] text-gray-400">Step 1</span>
          Sanding & Prep
        </div>
        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <div className="text-sm mb-0.5">🎨</div>
          <span className="block text-[10px] text-gray-400">Step 2</span>
          Acrylic Layers
        </div>
        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <div className="text-sm mb-0.5">🧪</div>
          <span className="block text-[10px] text-gray-400">Step 3</span>
          Resin Curing
        </div>
      </div>

      {/* Interactive Toggle Button to reveal deeper details */}
      <button 
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full text-center text-xs font-semibold py-2 bg-amber-50 text-amber-900 rounded-lg hover:bg-amber-100 transition-colors"
      >
        {showBreakdown ? "Hide Production Insights ↑" : "View Production Insights ↓"}
      </button>

      {/* The educational content block that displays dynamically */}
      {showBreakdown && (
        <div className="mt-4 pt-4 border-t border-dashed border-gray-100 text-xs text-gray-600 space-y-2 animate-fadeIn">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Workshop Time:</span>
            <span className="font-mono font-semibold text-gray-700">14 Hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Curing / Drying Wait:</span>
            <span className="font-mono font-semibold text-gray-700">48 Hours</span>
          </div>
          <p className="bg-gray-50 p-3 rounded-lg text-gray-500 leading-relaxed mt-2">
            "Original handmade art cannot be automated. This piece requires multiple thin acrylic layers, followed by a high-gloss protective epoxy coat that must sit undisturbed for two full days to avoid dust bubbles."
          </p>
        </div>
      )}

    </div>
  );
}

export default HandworkCard;