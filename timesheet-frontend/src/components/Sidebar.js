import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const SidebarContainer = styled.div`
    width: 180px;
    height: 100vh;
    background-color: #0056b3;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    padding-top: 20px;
`;

const Logo = styled.h1`
    color: white;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30px;
`;

const SidebarLink = styled(Link)`
    color: white;
    padding: 15px 20px;
    text-decoration: none;
    font-size: 18px;
    display: block;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #003f7f;
    }
`;

const LogoutButton = styled.button`
    background: none;
    color: white;
    border: none;
    font-size: 18px;
    padding: 15px 20px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    margin-top: auto;
    &:hover {
        background-color: #003f7f;
    }
`;

const Sidebar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let user = null;

    if (token) {
        try {
            user = jwtDecode(token);
        } catch (err) {
            user = null;
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <SidebarContainer>
            <Logo>Mylantech</Logo>

            {!user ? (
                <>
                    <SidebarLink to="/login">Login</SidebarLink>
                    <SidebarLink to="/register">Register</SidebarLink>
                </>
            ) : (
                <>
                    
                    <SidebarLink to="/timesheet-table">
                        Timesheet Table
                    </SidebarLink>
                    <SidebarLink to="/timesheet">Submit Timesheet</SidebarLink>
                    {user.role === 'admin' && (
                        <SidebarLink to="/admin-dashboard">
                            Admin Dashboard
                        </SidebarLink>
                    )}
                    <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                </>
            )}
        </SidebarContainer>
    );
};

export default Sidebar;
