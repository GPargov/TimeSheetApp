// src/components/LeaveApplicationsList.js
import React, { useEffect, useState } from 'react';
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

const API_URL = 'http://localhost:5000';

const LeaveApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/leave`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(res.data);
      } catch (err) {
        enqueueSnackbar(
          err.response?.data?.message || 'Failed to fetch leave applications',
          { variant: 'error' }
        );
      }
    };
    fetchApplications();
  }, [enqueueSnackbar]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Leave Applications
      </Typography>
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Applied At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>{new Date(app.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(app.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{app.reason}</TableCell>
                  <TableCell>{app.status}</TableCell>
                  <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default LeaveApplicationsList;
