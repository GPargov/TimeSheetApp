import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  background-color: #007bff;
  color: white;
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
`;

const AdminDashboard = () => {
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchTimesheets = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/timesheets', {
          headers: { Authorization: token }
        });
        setTimesheets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTimesheets();
  }, []);

  return (
    <DashboardContainer>
      <h2>Admin Dashboard</h2>
      <Table>
        <thead>
          <tr>
            <Th>User</Th>
            <Th>Date</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
            <Th>Break Time</Th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((timesheet) => (
            <tr key={timesheet._id}>
              <Td>{timesheet.userId.name}</Td>
              <Td>{new Date(timesheet.date).toLocaleDateString()}</Td>
              <Td>{timesheet.startTime}</Td>
              <Td>{timesheet.endTime}</Td>
              <Td>{timesheet.breakTime}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardContainer>
  );
};

export default AdminDashboard;
