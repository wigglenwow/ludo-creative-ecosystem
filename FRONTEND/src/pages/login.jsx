import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      // Triggers the login sequence inside AuthContext
      await login(formData.email, formData.password);
      
      // Redirect cleanly back to the marketplace main catalog page on success
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or security password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-6 bg-white border border-gray-100 rounded-xl shadow-sm animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black tracking-tight text-[#121212]">Sign In to LUDO</h2>
        <p className="text-gray-400 text-xs mt-1">Access your studio panel and messages</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-900 rounded-lg text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-gray-600 font-semibold mb-1">Email Address</label>
          <input 
            type="email" 
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="artist@ludo.com"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#121212] font-medium text-sm"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">Security Password</label>
          <input 
            type="password" 
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#121212] font-medium text-sm"
          />
        </div>

        <button 
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 mt-2 bg-[#121212] text-white font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm shadow-sm"
        >
          {submitting ? "Verifying Credentials..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-gray-400 text-xs mt-4">
        Don't have an account yet? <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Join Now</Link>
      </p>
    </div>
  );
}

export default Login;