import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Core Layout & Page Imports - Verify these files exist in your src/pages folder!
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import Messages from './pages/Messages';

// A lightweight diagnostic fallback layout to capture routing runtime breaks
class AppErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Core Routing Runtime Crash Log:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto mt-24 p-8 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-sans text-rose-950 space-y-4">
          <h1 className="text-sm font-black text-rose-900">🚨 Core React Application Shell Crash</h1>
          <p className="font-medium text-rose-800/80">A critical runtime error broke the main module layout thread before rendering the UI pages.</p>
          <div className="p-4 bg-white/60 border border-rose-100 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto text-rose-900">
            {this.state.error?.toString()}
          </div>
          <button onClick={() => window.location.href = '/'} className="px-4 py-2 bg-rose-900 text-white font-bold rounded-lg hover:bg-rose-950 transition-colors">
            Reset to Main Catalog
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <AppErrorBoundary>
      <div className="min-h-screen bg-gray-50 text-[#121212] font-sans antialiased">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </main>
      </div>
    </AppErrorBoundary>
  );
}

export default App;