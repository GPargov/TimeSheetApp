// src/components/TimesheetTable.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const API_URL = 'http://localhost:5000'; // Ensure this matches your backend server

const TimesheetTable = () => {
  const { user } = useContext(AuthContext);
  const [timesheets, setTimesheets] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const fetchTimesheets = async () => {
        try {
          const token = localStorage.getItem('token');

          if (!token || typeof token !== 'string') {
            throw new Error('Invalid or missing token');
          }

          console.log('Fetching timesheets with token:', token); // Debugging line

          const res = await axios.get(`${API_URL}/timesheet`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTimesheets(res.data);
        } catch (err) {
          console.error('Error fetching timesheets:', err.response || err.message);
          enqueueSnackbar(
            err.response?.data?.message || err.message || 'Failed to fetch timesheets',
            { variant: 'error' }
          );

          if (err.response && err.response.status === 401) {
            // Token might be invalid or expired; redirect to login
            navigate('/login');
          }
        }
      };
      fetchTimesheets();
    }
  }, [user, enqueueSnackbar, navigate]);

  if (!user) {
    return null;
  }

  // Function to calculate Work Time
  const calculateWorkTime = (startTime, endTime, breakTime) => {
    // Parse Start Time
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;

    // Parse End Time
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const endTotalMinutes = endHours * 60 + endMinutes;

    // Calculate Total Work Minutes
    let workMinutes = endTotalMinutes - startTotalMinutes - breakTime;

    // Handle Negative Work Time
    if (workMinutes < 0) {
      workMinutes = 0;
    }

    // Convert Back to Hours and Minutes
    const hours = Math.floor(workMinutes / 60);
    const minutes = workMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Timesheets
      </Typography>
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Break Time (minutes)</TableCell>
                <TableCell>Work Time</TableCell> {/* New Header */}
              </TableRow>
            </TableHead>
            <TableBody>
              {timesheets.map((timesheet) => (
                <TableRow key={timesheet._id}>
                  <TableCell>
                    {new Date(timesheet.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{timesheet.startTime}</TableCell>
                  <TableCell>{timesheet.endTime}</TableCell>
                  <TableCell>{timesheet.breakTime}</TableCell>
                  <TableCell>
                    {calculateWorkTime(
                      timesheet.startTime,
                      timesheet.endTime,
                      timesheet.breakTime
                    )}
                  </TableCell> {/* Calculated Work Time */}
                </TableRow>
              ))}
              {timesheets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No timesheets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default TimesheetTable;
