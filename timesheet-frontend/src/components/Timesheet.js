import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const TimesheetContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const TimesheetForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

const Timesheet = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [breakTime, setBreakTime] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Ensure token is logged

    try {
      const res = await axios.post(
        'http://localhost:5000/timesheet/create',
        { date, startTime, endTime, breakTime },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Make sure the Bearer token is sent
          },
        }
      );
      alert('Timesheet created');
      setDate('');
      setStartTime('');
      setEndTime('');
      setBreakTime('');
      navigate('/timesheet-table');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <TimesheetContainer>
      <TimesheetForm onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Timesheet</h2>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="Start Time (e.g. 09:00)"
          required
        />
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder="End Time (e.g. 17:00)"
          required
        />
        <Input
          type="number"
          value={breakTime}
          onChange={(e) => setBreakTime(e.target.value)}
          placeholder="Break Time (e.g. 01:00)"
          required
        />
        <Button type="submit">Submit</Button>
      </TimesheetForm>
    </TimesheetContainer>
  );
};

export default Timesheet;
