import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {jwtDecode} from 'jwt-decode';

const Nav = styled.nav`
  background-color: #007bff;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  padding: auto 3rem;
  margin: auto 3rem;
  margin-right: 15px;
  align-content: center;
  &:hover {
    text-decoration: underline;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch (err) {
      console.error('Error decoding token:', err);
      user = null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Nav>
      <h1 style={{ color: 'white' }}>Timesheet App</h1>
      <div>
        {!user ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        ) : (
          <>
            <span style={{ color: 'white', marginRight: '15px' }}>
              Hello, {user.name || 'User'}
            </span>
            <NavLink to="/timesheet-table">Timesheet Table</NavLink>
            <NavLink to="/timesheet">Timesheet</NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin-dashboard">Admin Dashboard</NavLink>
            )}
            <button
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                marginLeft: '15px',
                textDecoration: 'underline',
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </Nav>
  );
};

export default Navbar;
