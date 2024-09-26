import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  TableContainer,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { AuthContext } from './AuthContext';

const API_URL = 'http://localhost:5000'; // Hardcoded API URL

const LeaveApproval = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/leaves`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaveApplications(res.data);
      } catch (err) {
        enqueueSnackbar('Failed to fetch leave applications', { variant: 'error' });
      }
    };
    fetchLeaveApplications();
  }, [token, enqueueSnackbar]);

  const handleApprove = async (leaveId) => {
    try {
      await axios.patch(
        `${API_URL}/admin/leaves/${leaveId}`,
        { status: 'Approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      enqueueSnackbar('Leave approved successfully', { variant: 'success' });
      // Remove the approved leave from the table
      setLeaveApplications((prev) => prev.filter((leave) => leave._id !== leaveId));
    } catch (err) {
      enqueueSnackbar('Failed to approve leave', { variant: 'error' });
    }
  };

  const handleReject = async (leaveId) => {
    try {
      await axios.patch(
        `${API_URL}/admin/leaves/${leaveId}`,
        { status: 'Rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      enqueueSnackbar('Leave rejected successfully', { variant: 'success' });
      // Remove the rejected leave from the table
      setLeaveApplications((prev) => prev.filter((leave) => leave._id !== leaveId));
    } catch (err) {
      enqueueSnackbar('Failed to reject leave', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Leave Approval
      </Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveApplications.map((leave) => (
                <TableRow key={leave._id}>
                  <TableCell>{leave.userId.name}</TableCell>
                  <TableCell>{leave.userId.email}</TableCell>
                  <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{leave.leaveType}</TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell>{leave.status}</TableCell>
                  <TableCell>
                    {leave.status === 'Pending' ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApprove(leave._id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleReject(leave._id)}
                        >
                          Reject
                        </Button>
                      </Box>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {leaveApplications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No leave applications found.
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

export default LeaveApproval;
