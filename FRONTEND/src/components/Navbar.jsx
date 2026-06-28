import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo home link */}
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="text-2xl font-black tracking-wider text-[#121212]">
            LUDO
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            Creative Ecosystem
          </span>
        </Link>

        {/* Core Global Paths Selection */}
        <div className="hidden md:flex items-center space-x-8 font-medium text-sm text-gray-600">
          <Link to="/" className="hover:text-[#121212] transition-colors">Browse Marketplace</Link>
          <Link to="/messages" className="hover:text-[#121212] transition-colors">Messages</Link>
        </div>

        {/* Dynamic Auth Section Panel */}
        <div className="flex items-center space-x-4">
          {/* Only show Artist Dashboard option if user is logged in as a seller */}
          {user && user.role === 'seller' && (
            <Link to="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
              Studio Dashboard
            </Link>
          )}

          {user ? (
            <div className="flex items-center space-x-3 text-xs">
              <span className="text-gray-500 font-medium">Hi, <strong>{user.name}</strong></span>
              <button 
                onClick={handleLogoutClick}
                className="px-3 py-1.5 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[#121212] transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 bg-[#121212] text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm">
                Join
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;