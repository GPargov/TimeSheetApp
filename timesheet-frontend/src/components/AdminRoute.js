import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded?.user?.role === 'admin') {
        return children; // If user role is admin, allow access
      } else {
        return <Navigate to="/login" />; // If user is not admin, redirect to login
      }
    } catch (err) {
      console.error('Error decoding token:', err.message);
      return <Navigate to="/login" />; // In case of error, redirect to login
    }
  }

  return <Navigate to="/login" />; // If no token, redirect to login
};

export default AdminRoute;
