// src/components/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); // Debugging line
    if (token && typeof token === 'string') {
      try {
        const decoded = jwtDecode(token);
        // Check token expiration
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token expired
          console.warn('Token has expired.');
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser(decoded.user);
          console.log('User set from decoded token:', decoded.user); // Debugging line
        }
      } catch (err) {
        console.error('Error decoding token:', err.message);
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      console.warn('No token found or token is not a string.');
    }
  }, []);

  const login = (token) => {
    console.log('Logging in with token:', token); // Debugging line
    if (typeof token !== 'string') {
      console.error('Login failed: Token must be a string');
      return;
    }

    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded.user);
      console.log('User set from decoded token:', decoded.user); // Debugging line
    } catch (err) {
      console.error('Error decoding token during login:', err.message);
      setUser(null);
    }
  };

  const logout = () => {
    console.log('Logging out. Removing token from localStorage.'); // Debugging line
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
