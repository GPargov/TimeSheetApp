import React, { useContext } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import {
  Dashboard as DashboardIcon,
  AccessTime as AccessTimeIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  EventNote as EventNoteIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { ColorModeContext } from '../ThemeContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ width: 250 }}>
      <Drawer variant="permanent" anchor="left">
        {/* Sidebar Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Typography variant="h6" noWrap>
            Mylantech
          </Typography>
          <IconButton onClick={toggleColorMode} color="inherit">
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Box>

        {/* Navigation Links */}
        <List>
          {!user ? (
            <>
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/login">
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            </>
          ) : user.role === 'admin' ? (
            <>
              {/* Admin-Specific Links */}
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/admin-dashboard">
                  <ListItemIcon>
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/leave-approval">
                  <ListItemIcon>
                    <EventNoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Leave Approval" />
                </ListItemButton>
              </ListItem>

              {/* Logout */}
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              {/* User-Specific Links */}
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/timesheet-table">
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Timesheets" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/timesheet">
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Submit Timesheet" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/leave-application">
                  <ListItemIcon>
                    <EventNoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Apply for Leave" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/my-leave-applications">
                  <ListItemIcon>
                    <EventNoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Leave List" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/profile">
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>

              {/* Logout */}
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
