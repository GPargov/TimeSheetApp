// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSnackbar } from 'notistack';

const API_URL = 'http://localhost:5000'; // Hardcoded API URL

const AdminDashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [timesheetData, setTimesheetData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch (err) {
        enqueueSnackbar('Failed to fetch employees', { variant: 'error' });
      }
    };
    fetchEmployees();
  }, [token, enqueueSnackbar]);

  useEffect(() => {
    if (selectedEmployee) {
      const fetchTimesheetData = async () => {
        try {
          const res = await axios.get(
            `${API_URL}/admin/timesheets/${selectedEmployee}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = res.data.map((entry) => ({
            date: new Date(entry.date).toLocaleDateString(),
            hoursWorked: calculateHours(entry.startTime, entry.endTime, entry.breakTime),
            leaveDays: entry.leaveDays || 0,
          }));
          setTimesheetData(data);
        } catch (err) {
          enqueueSnackbar('Failed to fetch timesheet data', { variant: 'error' });
        }
      };
      fetchTimesheetData();
    }
  }, [selectedEmployee, token, enqueueSnackbar]);

  const calculateHours = (startTime, endTime, breakTime) => {
    const start = new Date(`1970-01-01T${startTime}:00Z`);
    const end = new Date(`1970-01-01T${endTime}:00Z`);
    let diff = (end - start) / (1000 * 60 * 60);

    if (diff < 0) {
      diff += 24;
    }

    const [breakHours, breakMinutes] = breakTime.split(':').map(Number);
    const breakInHours = breakHours + breakMinutes / 60;

    return diff - breakInHours;
  };

  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Employee Work Hours',
    },
    xAxis: {
      categories: timesheetData.map((data) => data.date),
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Hours',
      },
    },
    series: [
      {
        name: 'Hours Worked',
        data: timesheetData.map((data) => data.hoursWorked),
      },
      {
        name: 'Leave Days',
        data: timesheetData.map((data) => data.leaveDays),
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Select Employee</InputLabel>
          <Select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            label="Select Employee"
          >
            {employees.map((employee) => (
              <MenuItem key={employee._id} value={employee._id}>
                {employee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
      {timesheetData.length > 0 && (
        <Paper elevation={3} sx={{ padding: 2 }}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Paper>
      )}
    </Container>
  );
};

export default AdminDashboard;
