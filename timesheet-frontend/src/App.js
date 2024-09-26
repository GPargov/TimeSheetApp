// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/AuthContext';
import Sidebar from './components/Sidebar';
import Timesheet from './components/Timesheet';
import TimesheetTable from './components/TimesheetTable';
import LeaveApplication from './components/LeaveApplication';
import LeaveApplicationsList from './components/LeaveApplicationsList';
import LeaveApproval from './components/LeaveApproval';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard'; // Import AdminDashboard
import AdminRoute from './components/AdminRoute'; // Import AdminRoute
import { SnackbarProvider } from 'notistack';
import ThemeContextProvider from './ThemeContext';
import { useSnackbar } from 'notistack';

function App() {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <SnackbarProvider maxSnack={3}>
          <Router>
            <Sidebar />
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
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
              {/* Admin Dashboard Route */}
              <Route
                path="/admin-dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route path="/leave-approval" element={<AdminRoute><LeaveApproval /></AdminRoute>} />
              {/* Add other routes as needed */}
            </Routes>
          </Router>
        </SnackbarProvider>
      </ThemeContextProvider>
    </AuthProvider>
  );
}

/**
 * PrivateRoute Component
 * 
 * This component protects private routes, ensuring only authenticated users can access them.
 * It checks if the user is authenticated; if not, it redirects to the login page.
 */
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  if (!user) {
    enqueueSnackbar('You need to be logged in to access this page.', { variant: 'warning' });
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default App;
