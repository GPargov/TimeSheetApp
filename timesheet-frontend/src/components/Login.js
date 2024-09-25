// src/components/Login.js
import React, { useContext } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useSnackbar } from 'notistack';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000'; // Ensure this matches your backend server

const Login = () => {
  const { login } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post(`${API_URL}/auth/login`, values, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Login Response:', res.data); // Debugging line

        // Check if res.data.token exists and is a string
        if (res.data && typeof res.data.token === 'string') {
          login(res.data.token); // Store token and set user in context
          enqueueSnackbar('Logged in successfully!', { variant: 'success' });
          resetForm();
          navigate('/timesheet-table'); // Redirect to timesheet table after login
        } else {
          throw new Error('Invalid token received from server');
        }
      } catch (err) {
        console.error('Login error:', err.response || err.message);
        enqueueSnackbar(
          err.response?.data?.errors?.[0]?.msg || err.message || 'Failed to login',
          { variant: 'error' }
        );
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('password')}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
