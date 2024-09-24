import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 40px); /* Adjust based on sidebar */
  background-color: #f8f9fa;
`;

const Form = styled.form`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #0056b3;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #28a745;
  color: white;
  padding: 12px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #218838;
  }
`;

const Timesheet = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [breakTime, setBreakTime] = useState('00:00');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:5000/timesheet/create',
        { date, startTime, endTime, breakTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/timesheet-table');
      setDate('');
      setStartTime('');
      setEndTime('');
      setBreakTime('');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <h2>Submit Timesheet</h2>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        <Input type="time" value={breakTime} onChange={(e) => setBreakTime(e.target.value)} required />
        <Button type="submit">Submit</Button>
      </Form>
    </FormContainer>
  );
};

export default Timesheet;










