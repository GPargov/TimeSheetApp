// src/themes/theme.js
import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#1976d2', // Adjust to your company's primary color
    },
    secondary: {
      main: '#dc004e', // Adjust to your company's secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
});

export const theme = (mode) => createTheme(getDesignTokens(mode));
