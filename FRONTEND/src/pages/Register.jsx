import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer' // Default starting state
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Sends whatever role the user selected straight to your signup backend
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email address.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-6 bg-white border border-gray-100 rounded-xl shadow-sm animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black tracking-tight text-[#121212]">Create LUDO Account</h2>
        <p className="text-gray-400 text-xs mt-1">Join the digital workspace ecosystem</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-900 rounded-lg text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-gray-600 font-semibold mb-1">Creative Handle / Name</label>
          <input 
            type="text" name="name" required value={formData.name} onChange={handleChange}
            placeholder="e.g., Alex Jani"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#121212] font-medium text-sm"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">Email Address</label>
          <input 
            type="email" name="email" required value={formData.email} onChange={handleChange}
            placeholder="alex@ludo.com"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#121212] font-medium text-sm"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">Security Password</label>
          <input 
            type="password" name="password" required value={formData.password} onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#121212] font-medium text-sm"
          />
        </div>

       <div>
          <label className="block text-gray-600 font-semibold mb-1">Account Role Type</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#121212] font-medium text-sm cursor-pointer"
          >
            {/* These exact values map neatly to your backend schema model properties */}
            <option value="buyer">Art Collector / Buyer</option>
            <option value="seller">Independent Creator / Seller</option> {/* <-- CHANGE THIS VALUE TO seller */}
          </select>
        </div>
        
        <button 
          type="submit" disabled={submitting}
          className="w-full py-2.5 mt-2 bg-[#121212] text-white font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm shadow-sm"
        >
          {submitting ? "Deploying Core Identity..." : "Register Account"}
        </button>
      </form>

      <p className="text-center text-gray-400 text-xs mt-4">
        Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</Link>
      </p>
    </div>
  );
}

export default Register;