// src/components/LeaveApplication.js
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

const API_URL = 'http://localhost:5000'; // Replace with your API URL if different

const LeaveApplication = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      startDate: '',
      endDate: '',
      reason: '',
    },
    validationSchema: Yup.object({
      startDate: Yup.date().required('Start date is required'),
      endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date cannot be before start date'),
      reason: Yup.string().required('Reason is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `${API_URL}/leave/apply`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        enqueueSnackbar('Leave application submitted successfully', {
          variant: 'success',
        });
        resetForm();
      } catch (err) {
        enqueueSnackbar(
          err.response?.data?.message || 'Failed to submit leave application',
          { variant: 'error' }
        );
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          Apply for Leave
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            label="Start Date"
            type="date"
            name="startDate"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('startDate')}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
          />
          <TextField
            label="End Date"
            type="date"
            name="endDate"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('endDate')}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && formik.errors.endDate}
          />
          <TextField
            label="Reason"
            name="reason"
            fullWidth
            margin="normal"
            multiline
            rows={4}
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
            Submit Application
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LeaveApplication;
