// src/components/Timesheet.js
import React, { useContext, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const Timesheet = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: {
      date: '',
      startTime: '',
      endTime: '',
      breakTime: '',
    },
    validationSchema: Yup.object({
      date: Yup.date().required('Date is required'),
      startTime: Yup.string().required('Start time is required'),
      endTime: Yup.string().required('End time is required'),
      breakTime: Yup.number()
        .min(0, 'Break time cannot be negative')
        .required('Break time is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/timesheet/create`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        enqueueSnackbar('Timesheet submitted successfully', {
          variant: 'success',
        });
        resetForm();
        navigate('/timesheet-table');
      } catch (err) {
        enqueueSnackbar(
          err.response?.data?.message || 'Failed to submit timesheet',
          { variant: 'error' }
        );
      }
    },
  });

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          Submit Timesheet
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            label="Date"
            type="date"
            name="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('date')}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
          />
          <TextField
            label="Start Time"
            type="time"
            name="startTime"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('startTime')}
            error={formik.touched.startTime && Boolean(formik.errors.startTime)}
            helperText={formik.touched.startTime && formik.errors.startTime}
          />
          <TextField
            label="End Time"
            type="time"
            name="endTime"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('endTime')}
            error={formik.touched.endTime && Boolean(formik.errors.endTime)}
            helperText={formik.touched.endTime && formik.errors.endTime}
          />
          <TextField
            label="Break Time (in minutes)"
            name="breakTime"
            type="number"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps('breakTime')}
            error={formik.touched.breakTime && Boolean(formik.errors.breakTime)}
            helperText={formik.touched.breakTime && formik.errors.breakTime}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Timesheet;
