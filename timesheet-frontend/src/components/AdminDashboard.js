import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
} from '@mui/material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { useSnackbar } from 'notistack';
import { parseISO, differenceInHours, format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const API_URL = 'http://localhost:5000';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6699'];

const AdminDashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [timesheetData, setTimesheetData] = useState([]);
  const [filteredTimesheetData, setFilteredTimesheetData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [totalLeaveDays, setTotalLeaveDays] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [totalOvertimeHours, setTotalOvertimeHours] = useState(0); // Add state for total overtime hours
  const [isLoading, setIsLoading] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const token = localStorage.getItem('token');

  // DataGrid columns
  const columns = [
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'startTime', headerName: 'Start Time', width: 130 },
    { field: 'endTime', headerName: 'End Time', width: 130 },
    { field: 'breakTime', headerName: 'Break Time (hrs)', width: 150 },
    { field: 'hoursWorked', headerName: 'Hours Worked', width: 130 },
    { field: 'leaveDays', headerName: 'Leave Days', width: 130 },
  ];

  // Function to download data as Excel
  const handleDownload = () => {
    if (filteredTimesheetData.length === 0) {
      enqueueSnackbar('No data available to download', { variant: 'warning' });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredTimesheetData.map((entry) => ({
        Date: format(entry.date, 'MM/dd/yyyy'),
        'Start Time': entry.startTime,
        'End Time': entry.endTime,
        'Break Time (hrs)': entry.breakTime.toFixed(2),
        'Hours Worked': entry.hoursWorked,
        'Leave Days': entry.leaveDays,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Timesheet Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `Timesheet_Data_${selectedMonth}.xlsx`);
  };

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_URL}/admin/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch (err) {
        enqueueSnackbar('Failed to fetch employees', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, [token, enqueueSnackbar]);

  // Fetch timesheet data when an employee is selected
  useEffect(() => {
    if (selectedEmployee) {
      const fetchTimesheetData = async () => {
        setIsChartLoading(true);
        try {
          const res = await axios.get(
            `${API_URL}/admin/timesheets/${selectedEmployee}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.data.length === 0) {
            enqueueSnackbar('No timesheet data available', { variant: 'warning' });
            setTimesheetData([]);
            setFilteredTimesheetData([]);
            setWeeklyHours(0);
            setMonthlyHours(0);
            setTotalLeaveDays(0);
            setOvertimeHours(0);
            setTotalOvertimeHours(0); // Reset total overtime when no data
          } else {
            const data = res.data.map((entry) => {
              const hoursWorked = calculateHours(entry.startTime, entry.endTime, entry.breakTime);
              return {
                id: entry._id,
                date: new Date(entry.date),
                formattedDate: format(new Date(entry.date), 'MM/dd/yyyy'),
                breakTime: parseInt(entry.breakTime, 10) / 60,
                hoursWorked: isNaN(hoursWorked) ? 0 : parseFloat(hoursWorked.toFixed(2)),
                leaveDays: parseInt(entry.leaveDays, 10) || 0,
                startTime: entry.startTime,
                endTime: entry.endTime,
              };
            });
            setTimesheetData(data);
            const filteredData = filterByMonth(data, selectedMonth);
            setFilteredTimesheetData(filteredData);
            calculateWeeklyAndMonthlyHours(filteredData, selectedMonth);
            calculateTotalLeaveDays(filteredData);
            calculateOvertime(filteredData); 
            calculateTotalOvertime(filteredData); // Calculate total overtime
          }
        } catch (err) {
          enqueueSnackbar('Failed to fetch timesheet data', { variant: 'error' });
        } finally {
          setIsChartLoading(false);
        }
      };
      fetchTimesheetData();
    }
  }, [selectedEmployee, token, enqueueSnackbar, selectedMonth]);

  // Function to calculate hours worked
  const calculateHours = (startTime, endTime, breakTime) => {
    if (!startTime || !endTime || !breakTime) return 0;
    const start = parseISO(`1970-01-01T${startTime}:00Z`);
    const end = parseISO(`1970-01-01T${endTime}:00Z`);
    let diff = differenceInHours(end, start);
    if (diff < 0) diff += 24;
    return diff - parseInt(breakTime, 10) / 60;
  };

  // Filter data by selected month
  const filterByMonth = (data, month) => {
    return data.filter((entry) => format(entry.date, 'yyyy-MM') === month);
  };

  // Calculate weekly and monthly hours
  const calculateWeeklyAndMonthlyHours = (data, month) => {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    let weeklyTotal = 0;
    let monthlyTotal = 0;

    data.forEach((entry) => {
      const entryDate = entry.date;
      if (entryDate >= oneWeekAgo && entryDate <= now) {
        weeklyTotal += entry.hoursWorked;
      }
      if (format(entryDate, 'yyyy-MM') === month) {
        monthlyTotal += entry.hoursWorked;
      }
    });

    setWeeklyHours(weeklyTotal);
    setMonthlyHours(monthlyTotal);
  };

  // Calculate total leave days
  const calculateTotalLeaveDays = (data) => {
    const totalLeaves = data.reduce((sum, entry) => sum + entry.leaveDays, 0);
    setTotalLeaveDays(totalLeaves);
  };

  // Calculate overtime (everything over 40 hours per week)
  const calculateOvertime = (data) => {
    const totalHours = data.reduce((sum, entry) => sum + entry.hoursWorked, 0);
    const overtime = totalHours > 40 ? totalHours - 40 : 0;
    setOvertimeHours(overtime);
  };

  // Calculate total overtime across all weeks
  const calculateTotalOvertime = (data) => {
    let overtimeTotal = 0;
    data.forEach((entry) => {
      const weeklyHours = entry.hoursWorked;
      if (weeklyHours > 40) {
        overtimeTotal += weeklyHours - 40;
      }
    });
    setTotalOvertimeHours(overtimeTotal);
  };

  // Memoized chart data
  const workHoursOverviewChart = useMemo(() => ({
    labels: filteredTimesheetData.map((data) => data.formattedDate),
    datasets: [
      {
        label: 'Hours Worked',
        data: filteredTimesheetData.map((data) => data.hoursWorked),
        backgroundColor: '#1976d2',
      },
      {
        label: 'Leave Days',
        data: filteredTimesheetData.map((data) => data.leaveDays),
        backgroundColor: '#d32f2f',
      },
    ],
  }), [filteredTimesheetData]);

  const monthlyWorkedHoursChart = useMemo(() => ({
    labels: filteredTimesheetData.map((data) => data.formattedDate),
    datasets: [
      {
        label: 'Monthly Hours Worked',
        data: filteredTimesheetData.map((data) => data.hoursWorked),
        borderColor: '#388e3c',
        backgroundColor: '#388e3c',
        fill: false,
      },
    ],
  }), [filteredTimesheetData]);

  const weeklyWorkedHoursChart = useMemo(() => ({
    labels: filteredTimesheetData.map((data) => data.formattedDate),
    datasets: [
      {
        label: 'Weekly Hours Worked',
        data: filteredTimesheetData.map((data) => data.hoursWorked),
        backgroundColor: '#f57c00',
      },
    ],
  }), [filteredTimesheetData]);

  const totalLeaveDaysChart = useMemo(() => ({
    labels: filteredTimesheetData.map((data) => data.formattedDate),
    datasets: [
      {
        label: 'Leave Days',
        data: filteredTimesheetData.map((data) => data.leaveDays),
        backgroundColor: COLORS,
      },
    ],
  }), [filteredTimesheetData]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Admin Dashboard
      </Typography>

      {isLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : (
        <>
          {/* Employee selection and key metrics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">Select Employee</Typography>
                <FormControl fullWidth>
                  <InputLabel>Select Employee</InputLabel>
                  <Select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    label="Select Employee"
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee._id} value={employee._id}>
                        {employee.name} ({employee.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Card sx={{ backgroundColor: '#e3f2fd' }}>
                    <CardContent>
                      <Typography variant="h6">Weekly Hours</Typography>
                      <Typography variant="h4">{weeklyHours.toFixed(2)} hrs</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card sx={{ backgroundColor: '#e8f5e9' }}>
                    <CardContent>
                      <Typography variant="h6">Monthly Hours</Typography>
                      <Typography variant="h4">{monthlyHours.toFixed(2)} hrs</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card sx={{ backgroundColor: '#ffebee' }}>
                    <CardContent>
                      <Typography variant="h6">Total Leave Days</Typography>
                      <Typography variant="h4">{totalLeaveDays}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card sx={{ backgroundColor: '#fff9c4' }}>
                    <CardContent>
                      <Typography variant="h6">Overtime</Typography>
                      <Typography variant="h4">{overtimeHours.toFixed(2)} hrs</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card sx={{ backgroundColor: '#ffe082' }}>
                    <CardContent>
                      <Typography variant="h6">Total Overtime</Typography>
                      <Typography variant="h4">{totalOvertimeHours.toFixed(2)} hrs</Typography> {/* Display total overtime */}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Chart section */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Bar
                  data={workHoursOverviewChart}
                  options={{
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Employee Work Hours Overview' },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Line
                  data={monthlyWorkedHoursChart}
                  options={{
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Monthly Worked Hours' },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Bar
                  data={weeklyWorkedHoursChart}
                  options={{
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Weekly Worked Hours' },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Pie
                  data={totalLeaveDaysChart}
                  options={{
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Total Leave Days' },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* DataGrid Section */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6">Worked Days</Typography>
                  <Grid item xs={12} md={8} container justifyContent="flex-end" spacing={2}>
                    <Grid item>
                      <FormControl variant="outlined" size="small">
                        <InputLabel>Select Month</InputLabel>
                        <Select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          label="Select Month"
                        >
                          {Array.from({ length: 12 }).map((_, index) => {
                            const date = new Date();
                            date.setMonth(index);
                            const month = format(date, 'yyyy-MM');
                            const label = format(date, 'MMMM yyyy');
                            return (
                              <MenuItem key={month} value={month}>
                                {label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="primary" onClick={handleDownload}>
                        Export to Excel
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <div style={{ height: 500, width: '100%' }}>
                  <DataGrid
                    rows={filteredTimesheetData.map((entry) => ({
                      id: entry.id,
                      date: entry.formattedDate,
                      startTime: entry.startTime,
                      endTime: entry.endTime,
                      breakTime: entry.breakTime.toFixed(2),
                      hoursWorked: entry.hoursWorked,
                      leaveDays: entry.leaveDays,
                    }))}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    sx={{
                      '& .MuiDataGrid-root': { border: 'none' },
                      '& .MuiDataGrid-cell': { borderBottom: 'none' },
                      '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f5f5f5', borderBottom: 'none' },
                      '& .MuiDataGrid-virtualScroller': { backgroundColor: '#fff' },
                      '& .MuiDataGrid-footerContainer': { backgroundColor: '#f5f5f5', borderTop: 'none' },
                    }}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;
