// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, message: '' });

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingAuth(false);
        return;
      }
      try {
        const me = await api.get('/api/auth/me');
        setUser(me);
      } catch (err) {
        // If token invalid (401) remove it; otherwise keep token (server might be down)
        if (err.status === 401) localStorage.removeItem('token');
        console.error('Auth check failed:', err);
      } finally {
        setLoadingAuth(false);
      }
    };
    init();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setModal({ isOpen: true, message: err.body?.message || err.message || 'Login failed' });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loadingAuth, login, logout, modal, setModal }}>
      {children}
    </AuthContext.Provider>
  );
};
