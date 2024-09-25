// src/components/Sidebar.js
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
  ExitToApp as ExitToAppIcon,
  EventNote as EventNoteIcon,
  Person as PersonIcon,
  LockOpen as LockOpenIcon,
  HowToReg as HowToRegIcon,
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
      <Drawer variant="permanent" sx={{ width: 250 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
          }}
        >
          <Typography variant="h5">Mylantech</Typography>
          <IconButton onClick={toggleColorMode} color="inherit">
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Box>
        <List>
          {!user ? (
            <>
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/login">
                  <ListItemIcon>
                    <LockOpenIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/register">
                  <ListItemIcon>
                    <HowToRegIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
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
                <ListItemButton component={RouterLink} to="/profile">
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
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
