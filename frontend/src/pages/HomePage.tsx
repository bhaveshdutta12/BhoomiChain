import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
} from '@mui/material';
import {
  Security,
  Public,
  Verified,
  Search,
  Add,
  Map,
  Dashboard,
  CheckCircle,
  Link,
  Cloud,
  TrendingUp,
  Speed,
  Group,
  AccountBalance,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  PageTransition,
  AnimatedGradientText,
  FloatingBox,
  GlowingBox,
  AnimatedStatsCard,
} from '../components/AnimatedComponents';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Security color="primary" />,
      title: 'Tamper-Proof Records',
      description: 'All land records are stored on blockchain, making them immutable and transparent.',
    },
    {
      icon: <Public color="primary" />,
      title: 'Public Verification',
      description: 'Citizens can verify land ownership information through our public search portal.',
    },
    {
      icon: <Verified color="primary" />,
      title: 'Government Verified',
      description: 'All land registrations are verified by authorized government officials.',
    },
    {
      icon: <Cloud color="primary" />,
      title: 'IPFS Document Storage',
      description: 'Property documents are securely stored on IPFS with blockchain hash references.',
    },
  ];

  const quickActions = [
    {
      title: 'Search Land Records',
      description: 'Find land information by survey number, owner address, or location',
      icon: <Search />,
      action: () => navigate('/search'),
      color: 'primary' as const,
    },
    {
      title: 'View on Map',
      description: 'Explore land properties on an interactive map visualization',
      icon: <Map />,
      action: () => navigate('/map'),
      color: 'secondary' as const,
    },
    {
      title: 'Register New Land',
      description: 'Register a new land property (Government officials only)',
      icon: <Add />,
      action: () => navigate('/register'),
      color: 'success' as const,
    },
    {
      title: 'View Dashboard',
      description: 'Access comprehensive statistics and analytics',
      icon: <Dashboard />,
      action: () => navigate('/dashboard'),
      color: 'info' as const,
    },
  ];

  const benefits = [
    'Transparent and tamper-proof land records',
    'Reduced fraud and disputes',
    'Faster property transfers',
    'Public verification of ownership',
    'Historical record tracking',
    'Secure document storage',
  ];

  return (
    <PageTransition>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <FloatingBox>
              <AnimatedGradientText variant="h1" sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                🏡 BhoomiChain
              </AnimatedGradientText>
            </FloatingBox>
            <Typography variant="h4" sx={{ mb: 3, color: 'text.secondary', fontWeight: 300 }}>
              Next-Gen Blockchain Land Registry
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}>
              Revolutionizing property ownership with immutable blockchain records, 
              smart contract automation, and decentralized document storage. 
              🌍 Welcome to the future of land management.
            </Typography>
            
            {/* Stats Row */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 6, flexWrap: 'wrap' }}>
              <AnimatedStatsCard title="Total Lands" value="1,234" icon="🏠" trend={12} />
              <AnimatedStatsCard title="Verified" value="98%" icon="✔️" trend={5} />
              <AnimatedStatsCard title="Transactions" value="5,678" icon="🔄" trend={24} />
            </Box>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Search />}
                onClick={() => navigate('/search')}
                sx={{ px: 4, py: 2 }}
              >
                Explore Properties
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Map />}
                onClick={() => navigate('/map')}
                sx={{ px: 4, py: 2 }}
              >
                View Map
              </Button>
            </Box>
          </Box>

          {/* Key Features */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <AnimatedGradientText variant="h3" gutterBottom>
                ⚡ Blockchain-Powered Features
              </AnimatedGradientText>
              <Typography variant="h6" color="text.secondary">
                Revolutionary technology meets practical land management
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {features.map((feature, index) => (
                <FloatingBox key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <GlowingBox sx={{ height: '100%', p: 3, cursor: 'pointer' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        background: 'linear-gradient(135deg, #00D4FF 0%, #6C5CE7 100%)',
                        mr: 2
                      }}>
                        {React.cloneElement(feature.icon, { sx: { color: '#000' } })}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </GlowingBox>
                </FloatingBox>
              ))}
            </Box>
          </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {quickActions.map((action, index) => (
              <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(25% - 18px)' } }}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' }, transition: 'transform 0.2s' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: `${action.color}.light`,
                          color: `${action.color}.dark`,
                        }}
                      >
                        {action.icon}
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ textAlign: 'center', mb: 1, fontWeight: 600 }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {action.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button size="small" color={action.color} onClick={action.action}>
                      Get Started
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Benefits */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 6 }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              Why BhoomiChain?
            </Typography>
            <Paper sx={{ p: 3 }}>
              <List>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon>
                      <CheckCircle color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              Technology Stack
            </Typography>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip icon={<Link />} label="Ethereum" color="primary" />
                <Chip label="Solidity" color="primary" />
                <Chip label="IPFS" color="secondary" />
                <Chip label="React.js" color="info" />
                <Chip label="Node.js" color="success" />
                <Chip label="Mapbox" color="warning" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Built with cutting-edge blockchain technology to ensure security, transparency, 
                and decentralization. Smart contracts handle all land transactions while IPFS 
                provides secure document storage.
              </Typography>
            </Paper>
          </Box>
        </Box>

          {/* Demo Notice */}
          <GlowingBox sx={{ p: 4, textAlign: 'center', mt: 8 }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'warning.main' }}>
              🚧 Prototype Demo
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
              Experience the future of land registry with our blockchain-powered prototype. 
              This demo showcases the core functionality of a decentralized property management system.
            </Typography>
          </GlowingBox>
        </Box>
      </Container>
    </PageTransition>
  );
};

export default HomePage;
