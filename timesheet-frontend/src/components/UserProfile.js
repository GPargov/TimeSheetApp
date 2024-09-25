// src/components/UserProfile.js
import React, { useContext, useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { AuthContext } from './AuthContext';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Move useState hooks to the top level
  const [name, setName] = useState(user ? user.name : '');
  const [email] = useState(user ? user.email : '');

  // Use useEffect for navigation
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Optionally, you can handle loading state
  if (!user) {
    return null; // Or a loading indicator
  }

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_URL}/users/${user.id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          User Profile
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Name"
            value={name}
            fullWidth
            margin="normal"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            value={email}
            fullWidth
            margin="normal"
            disabled
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleUpdate}
          >
            Update Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;
