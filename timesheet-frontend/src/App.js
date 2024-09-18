import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Timesheet from './components/Timesheet';
import TimesheetTable from './components/TimesheetTable';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import GlobalStyle from './components/GlobalStyles';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/timesheet"
          element={
            <PrivateRoute>
              <Timesheet />
            </PrivateRoute>
          }
        />
        <Route path="/timesheet-table" element={<TimesheetTable />} />
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
