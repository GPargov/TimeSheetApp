// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Sidebar from './components/Sidebar';
import Timesheet from './components/Timesheet';
import TimesheetTable from './components/TimesheetTable';
import LeaveApplication from './components/LeaveApplication';
import LeaveApplicationsList from './components/LeaveApplicationsList';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import { SnackbarProvider } from 'notistack';
import ThemeContextProvider from './ThemeContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <SnackbarProvider>
          <Router>
            <Sidebar />
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
              <Route
                path="/timesheet-table"
                element={
                  <PrivateRoute>
                    <TimesheetTable />
                  </PrivateRoute>
                }
              />
              <Route
                path="/leave-application"
                element={
                  <PrivateRoute>
                    <LeaveApplication />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-leave-applications"
                element={
                  <PrivateRoute>
                    <LeaveApplicationsList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />
              {/* Add other routes as needed */}
            </Routes>
          </Router>
        </SnackbarProvider>
      </ThemeContextProvider>
    </AuthProvider>
  );
}

export default App;
