import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const TableContainer = styled.div`
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

const TimesheetTable = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // To track if the user is admin

  useEffect(() => {
    const fetchTimesheets = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/timesheet', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTimesheets(res.data);

        // Check if the user is admin based on the token payload (JWT)
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
        setIsAdmin(decodedToken.role === 'admin'); // Set isAdmin based on role
      } catch (err) {
        console.error('Error fetching timesheets:', err);
      }
    };
    fetchTimesheets();
  }, []);

  return (
    <TableContainer>
      <h2>Your Working hours</h2>
      <Table>
        <thead>
          <tr>
            {isAdmin && <Th>User Name</Th>} {/* Show User Name column if admin */}
            <Th>Date</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
            <Th>Break Time</Th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((timesheet) => (
            <tr key={timesheet._id}>
              {isAdmin && <Td>{timesheet.userId?.name || 'N/A'}</Td>} {/* Show User Name if admin */}
              <Td>{new Date(timesheet.date).toLocaleDateString()}</Td>
              <Td>{timesheet.startTime}</Td>
              <Td>{timesheet.endTime}</Td>
              <Td>{timesheet.breakTime}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default TimesheetTable;
