import React, { useState } from 'react';

function SmartGuide() {
  // Local checklist trackers to make the educational experience interactive
  const [checks, setChecks] = useState({
    dimensions: false,
    medium: false,
    timeline: false,
    sketches: false
  });

  const toggleCheck = (key) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-100 rounded-xl p-5 shadow-sm sticky top-24">
      
      {/* Header Banner */}
      <div className="flex items-center space-x-2 text-indigo-700 font-semibold text-xs uppercase tracking-wider mb-3">
        <span>💡 Ludo Commission Advisor</span>
      </div>

      <h3 className="text-base font-bold text-[#121212] mb-1">
        Custom Alignment Guide
      </h3>
      <p className="text-gray-500 text-xs mb-4">
        Ensure client expectations match your studio process before locking the order.
      </p>

      {/* Interactive Creator Checklist */}
      <div className="space-y-2.5 mb-5">
        <label className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-xs text-gray-700">
          <input 
            type="checkbox" 
            checked={checks.dimensions} 
            onChange={() => toggleCheck('dimensions')}
            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
          <div>
            <span className={`font-semibold block ${checks.dimensions ? 'line-through text-gray-400' : ''}`}>
              Size & Dimensions Confirmed
            </span>
            <span className="text-gray-400 block text-[11px]">Ask for specific measurements (e.g., Hoodie size, Canvas dimensions).</span>
          </div>
        </label>

        <label className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-xs text-gray-700">
          <input 
            type="checkbox" 
            checked={checks.medium} 
            onChange={() => toggleCheck('medium')}
            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
          <div>
            <span className={`font-semibold block ${checks.medium ? 'line-through text-gray-400' : ''}`}>
              Material Medium Settled
            </span>
            <span className="text-gray-400 block text-[11px]">Clarify materials being used (e.g., Watercolor vs. Heavy Acrylics).</span>
          </div>
        </label>

        <label className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-xs text-gray-700">
          <input 
            type="checkbox" 
            checked={checks.timeline} 
            onChange={() => toggleCheck('timeline')}
            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
          <div>
            <span className={`font-semibold block ${checks.timeline ? 'line-through text-gray-400' : ''}`}>
              Curing & Shipping Windows Included
            </span>
            <span className="text-gray-400 block text-[11px]">Make sure the buyer explicitly knows how long raw coatings take to dry.</span>
          </div>
        </label>
      </div>

      {/* Pro-Tip Educational Highlight box */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3.5 text-xs text-indigo-900 leading-relaxed">
        <span className="font-bold block mb-1">🧠 Pro-Tip for Creators:</span>
        "Asking buyers to upload basic reference images directly into the chat thread early minimizes structural revisions by over 40%."
      </div>

    </div>
  );
}

export default SmartGuide;