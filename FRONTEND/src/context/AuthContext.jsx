import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Create a custom instance configured to talk directly to your Port 3000 backend
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Automatically attach your secure JWT token to every single outbound request
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      // Hits the profile path to verify token integrity and grab live account data
      const response = await api.get('/auth/profile');
      setUser(response.data?.user || response.data);
    } catch (err) {
      console.error("Auth profile sync skipped or unauthenticated session.");
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user: loggedInUser } = response.data;

    // Force the token straight onto the request headers immediately
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);

    setToken(token);
    setUser(loggedInUser);
    
    return response.data;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Exposes the auth state wrapper matrix cleanly to components
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};