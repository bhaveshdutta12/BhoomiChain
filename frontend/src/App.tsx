import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Import components and pages
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { LandDetailsPage, RegisterLandPage, TransfersPage, MapPage, DashboardPage } from './pages';
import LandTransfersPage from './pages/LandTransfersPage';
import UserRegistrationPage from './pages/UserRegistrationPage';
import GovernmentDashboardPage from './pages/GovernmentDashboardPage';

// Import providers
import { Web3Provider } from './contexts/Web3Context';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';

// Create Material-UI theme with Web3/Blockchain aesthetic
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00D4FF', // Cyan - Web3 signature color
      light: '#4DE6FF',
      dark: '#00A3CC',
      contrastText: '#000000',
    },
    secondary: {
      main: '#6C5CE7', // Purple - blockchain accent
      light: '#A29BFE',
      dark: '#5142B8',
    },
    success: {
      main: '#00B894', // Green for land/nature
      light: '#00CDA9',
      dark: '#00A085',
    },
    warning: {
      main: '#FDCB6E',
      light: '#FFDB8B',
      dark: '#E5B55A',
    },
    error: {
      main: '#E84393',
      light: '#FF6AB5',
      dark: '#C73E78',
    },
    background: {
      default: '#0F0F23', // Deep space blue
      paper: '#1A1A2E', // Dark navy
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B8BCC8',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 212, 255, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00D4FF 0%, #6C5CE7 100%)',
          boxShadow: '0 4px 15px rgba(0, 212, 255, 0.2)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0, 212, 255, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 212, 255, 0.2)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #00D4FF 0%, #6C5CE7 100%)',
          color: '#000000',
          fontWeight: 600,
          border: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.05)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00D4FF',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00D4FF',
              borderWidth: 2,
            },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3Provider>
        <AppProvider>
          <AuthProvider>
            <Router>
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1, pt: 2 }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<UserRegistrationPage />} />
                    <Route path="/register-land" element={<RegisterLandPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/land/:id" element={<LandDetailsPage />} />
                    <Route path="/transfers" element={<TransfersPage />} />
                    <Route path="/land-transfers" element={<LandTransfersPage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/government-dashboard" element={<GovernmentDashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </Box>
              </Box>
            </Router>
          </AuthProvider>
        </AppProvider>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;
