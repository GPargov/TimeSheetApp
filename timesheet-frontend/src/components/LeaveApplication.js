// src/components/LeaveApplication.js
import React, { useContext } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000'; // Ensure this matches your backend server

const LeaveApplication = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      startDate: '',
      endDate: '',
      leaveType: '',
      reason: '',
    },
    validationSchema: Yup.object({
      startDate: Yup.date().required('Start Date is required'),
      endDate: Yup.date()
        .min(Yup.ref('startDate'), 'End Date cannot be before Start Date')
        .required('End Date is required'),
      leaveType: Yup.string().required('Leave Type is required'),
      reason: Yup.string().required('Reason is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem('token');

        if (!token || typeof token !== 'string') {
          throw new Error('Invalid or missing token');
        }

        const res = await axios.post(
          `${API_URL}/leave/apply`,
          values,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Leave Application Response:', res.data); // Debugging line

        enqueueSnackbar('Leave applied successfully!', { variant: 'success' });
        resetForm();
        navigate('/my-leave-applications'); // Redirect to a page showing leave statuses
      } catch (err) {
        console.error('Error applying for leave:', err.response || err.message);
        enqueueSnackbar(
          err.response?.data?.message || err.message || 'Failed to apply for leave',
          { variant: 'error' }
        );
      }
    },
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          Apply for Leave
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('startDate')}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('endDate')}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && formik.errors.endDate}
          />
          <TextField
            label="Leave Type"
            name="leaveType"
            select
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('leaveType')}
            error={formik.touched.leaveType && Boolean(formik.errors.leaveType)}
            helperText={formik.touched.leaveType && formik.errors.leaveType}
          >
            <MenuItem value="Sick">Sick</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Earned">Earned</MenuItem>
            <MenuItem value="Maternity">Maternity</MenuItem>
            <MenuItem value="Paternity">Paternity</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            label="Reason"
            name="reason"
            type="text"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('reason')}
            error={formik.touched.reason && Boolean(formik.errors.reason)}
            helperText={formik.touched.reason && formik.errors.reason}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Apply
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LeaveApplication;
