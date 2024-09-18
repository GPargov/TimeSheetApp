import React from 'react';
import { Navigate } from 'react-router-dom';

// Check if the token exists in localStorage to determine if the user is logged in
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
