import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Timesheet from './components/Timesheet';
import TimesheetTable from './components/TimesheetTable';
import AdminDashboard from './components/AdminDashboard';
import Sidebar from './components/Sidebar'; // Use Sidebar instead of Navbar
import GlobalStyle from './components/GlobalStyles';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import styled from 'styled-components';

// Adjust the main content to account for the sidebar width
const MainContent = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <Sidebar /> {/* Sidebar replaces Navbar */}
      <MainContent>
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
      </MainContent>
    </Router>
  );
};

export default App;
