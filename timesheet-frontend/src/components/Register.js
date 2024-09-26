import React, { useContext, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useSnackbar } from 'notistack';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000'; // Hardcoded API URL

const Register = () => {
  const { login } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // To track role selection

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password should be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const { name, email, password } = values;
        const role = isAdmin ? 'admin' : 'user'; // Determine role based on checkbox

        const res = await axios.post(
          `${API_URL}/auth/register`,
          { name, email, password, role }, // Send role to the backend
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Check if res.data.token exists and is a string
        if (res.data && typeof res.data.token === 'string') {
          login(res.data.token); // Store token and set user in context
          enqueueSnackbar('Registered successfully!', { variant: 'success' });
          resetForm();
          navigate('/timesheet-table'); // Redirect after registration
        } else {
          throw new Error('Invalid token received from server');
        }
      } catch (err) {
        console.error('Registration error:', err.response || err.message);
        enqueueSnackbar(
          err.response?.data?.errors?.[0]?.msg || err.message || 'Failed to register',
          { variant: 'error' }
        );
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            label="Name"
            name="name"
            type="text"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
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
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('confirmPassword')}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                color="primary"
              />
            }
            label="Register as Admin"
            sx={{ mt: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login here</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
