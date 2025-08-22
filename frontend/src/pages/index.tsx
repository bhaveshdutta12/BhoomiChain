// Placeholder pages - these would be fully implemented in the complete version

import React from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Card, CardContent, Chip, Grid } from '@mui/material';
import InteractiveMap from '../components/InteractiveMap';

export const LandDetailsPage: React.FC = () => (
  <Container maxWidth="lg">
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Land Details</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>🚧 Detailed land information, ownership history, documents, and transfer status.</Typography>
      </Paper>
    </Box>
  </Container>
);

export { default as RegisterLandPage } from './RegisterLandPage';

export const TransfersPage: React.FC = () => (
  <Container maxWidth="lg">
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Land Transfers</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>🚧 Manage land ownership transfers - request, approve, and complete transfers.</Typography>
      </Paper>
    </Box>
  </Container>
);

export const MapPage: React.FC = () => {
  const [userAddress, setUserAddress] = React.useState('0x1234...5678'); // Get from Web3 context
  const [selectedLand, setSelectedLand] = React.useState<any>(null);

  const handleLandSelect = (land: any) => {
    setSelectedLand(land);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              background: 'linear-gradient(45deg, #00D4FF, #6C5CE7, #00B894)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold',
            }}
          >
            🗺️ Interactive Land Map
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explore land properties with interactive markers and detailed information
          </Typography>
        </Box>

        <Box sx={{ height: 600 }}>
          <InteractiveMap 
            userAddress={userAddress}
            onLandSelect={handleLandSelect}
            showUserLandsOnly={false}
          />
        </Box>
      </Box>
    </Container>
  );
};

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { title: 'Total Properties', value: '1,234', icon: '🏠', change: '+12%', color: 'primary' },
    { title: 'Verified Lands', value: '1,208', icon: '✅', change: '+5%', color: 'success' },
    { title: 'Pending Verification', value: '26', icon: '🕰️', change: '-15%', color: 'warning' },
    { title: 'Total Transactions', value: '5,678', icon: '🔄', change: '+24%', color: 'info' },
    { title: 'Active Users', value: '892', icon: '👥', change: '+8%', color: 'secondary' },
    { title: 'Revenue Generated', value: '₹2.1M', icon: '💰', change: '+18%', color: 'success' },
  ];

  const recentTransactions = [
    { id: 'TX-001', type: 'Registration', property: 'SUR-001-2024', amount: '₹50,000', status: 'Completed' },
    { id: 'TX-002', type: 'Transfer', property: 'SUR-002-2024', amount: '₹35,000', status: 'Pending' },
    { id: 'TX-003', type: 'Verification', property: 'SUR-003-2024', amount: '₹1,000', status: 'Completed' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              background: 'linear-gradient(45deg, #00D4FF, #6C5CE7, #00B894)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            📊 Analytics Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Real-time insights into your blockchain land registry system
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
          {stats.map((stat, index) => (
            <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' } }}>
              <Card
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0, 212, 255, 0.3)',
                  },
                }}
              >
                <Typography variant="h2" sx={{ mb: 1 }}>
                  {stat.icon}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    background: 'linear-gradient(45deg, #00D4FF, #6C5CE7)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 'bold',
                    mb: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Chip
                  label={stat.change}
                  color={stat.change.startsWith('+') ? 'success' : 'error'}
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Card>
            </Box>
          ))}
        </Box>

        {/* Recent Transactions */}
        <Paper
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
            🔍 Recent Transactions
          </Typography>
          {recentTransactions.map((tx, index) => (
            <Box
              key={tx.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                mb: 2,
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(0, 212, 255, 0.05)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  {tx.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tx.type} • {tx.property}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" sx={{ color: 'success.main' }}>
                  {tx.amount}
                </Typography>
                <Chip
                  label={tx.status}
                  color={tx.status === 'Completed' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};
