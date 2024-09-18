import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtDecode(token);
    return decoded.role === 'admin' ? children : <Navigate to="/login" />;
  }
  return <Navigate to="/login" />;
};

export default AdminRoute;
