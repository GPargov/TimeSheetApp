import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {jwtDecode} from 'jwt-decode'; // Correct import

const TableContainer = styled.div`
  padding: 10px;
  margin-left: 180px; /* Adjust for sidebar */
  margin-top: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 40px); /* Maintain full height of viewport */
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  background-color: #007bff;
  color: white;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
`;

const Header = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const TimesheetTable = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
  const [user, setUser] = useState({}); // Store the decoded user

  useEffect(() => {
    const fetchTimesheets = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedUser = jwtDecode(token); // Decode JWT using jwtDecode
          setUser(decodedUser);
          setIsAdmin(decodedUser.role === 'admin'); // Set isAdmin based on role
        } catch (err) {
          console.error('Error decoding token:', err);
        }
      }

      try {
        const res = await axios.get('http://localhost:5000/timesheet', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTimesheets(res.data);
      } catch (err) {
        console.error('Error fetching timesheets:', err);
      }
    };
    fetchTimesheets();
  }, []);

  return (
    <TableContainer>
      <Header>Hello, {user.name || 'User'}</Header> {/* Display decoded user's name */}
      <Table>
        <thead>
          <tr>
            {isAdmin && <Th>User Name</Th>} {/* Show User Name column if admin */}
            <Th>Date</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
            <Th>Break Time in Min.</Th>
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
