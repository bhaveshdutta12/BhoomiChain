import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Grid,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person,
  Business,
  Visibility,
  VisibilityOff,
  Login,
  AccountBalance,
  VerifiedUser,
  Security,
  Wallet,
  QrCode,
  Help
} from '@mui/icons-material';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
  userType: UserRole;
  rememberMe: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { connectWallet, isLoading, error: walletError, isConnected } = useWeb3();
  const { login, isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletConnectDialog, setWalletConnectDialog] = useState(false);
  
  const [citizenLogin, setCitizenLogin] = useState<LoginCredentials>({
    email: '',
    password: '',
    userType: UserRole.CITIZEN,
    rememberMe: false
  });

  const [officialLogin, setOfficialLogin] = useState<LoginCredentials>({
    email: '',
    password: '',
    userType: UserRole.GOVERNMENT_OFFICIAL,
    rememberMe: false
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setError('');
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError('');

    try {
      const success = await login(credentials);
      
      if (success) {
        // Navigate based on user type
        if (credentials.userType === UserRole.CITIZEN) {
          navigate('/dashboard');
        } else if (credentials.userType === UserRole.GOVERNMENT_OFFICIAL || 
                   credentials.userType === UserRole.DEPARTMENT_HEAD || 
                   credentials.userType === UserRole.REGISTRAR) {
          navigate('/government-dashboard');
        } else if (credentials.userType === UserRole.FINANCIAL_INSTITUTION) {
          navigate('/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    setLoading(true);
    try {
      await connectWallet();
      // Don't redirect automatically - just connect the wallet
      // User can then login normally or use wallet-based authentication
      setWalletConnectDialog(false);
    } catch (e) {
      setError(walletError || 'Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCitizenLogin = () => (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Person sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Citizen Login
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Login to manage your land records and transactions
        </Typography>
      </Box>

      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          value={citizenLogin.email}
          onChange={(e) => setCitizenLogin(prev => ({ ...prev, email: e.target.value }))}
          sx={{ mb: 2 }}
          required
        />
        
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={citizenLogin.password}
          onChange={(e) => setCitizenLogin(prev => ({ ...prev, password: e.target.value }))}
          sx={{ mb: 2 }}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={citizenLogin.rememberMe}
              onChange={(e) => setCitizenLogin(prev => ({ ...prev, rememberMe: e.target.checked }))}
            />
          }
          label="Remember me"
          sx={{ mb: 2 }}
        />

        {(error || walletError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || walletError}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <Login />}
          onClick={() => handleLogin(citizenLogin)}
          disabled={loading || !citizenLogin.email || !citizenLogin.password}
          sx={{ mb: 2 }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<Wallet />}
          onClick={() => setWalletConnectDialog(true)}
          sx={{ mb: 2 }}
        >
          Connect Wallet
        </Button>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#00D4FF', textDecoration: 'none' }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const renderOfficialLogin = () => (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Business sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Official Login
        </Typography>
        <Typography variant="body2" color="text.secondary">
          For registrars, government officials, and institutions
        </Typography>
      </Box>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          This portal is exclusively for authorized officials. Unauthorized access is prohibited and monitored.
        </Typography>
      </Alert>

      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Official Email ID"
          type="email"
          value={officialLogin.email}
          onChange={(e) => setOfficialLogin(prev => ({ ...prev, email: e.target.value }))}
          sx={{ mb: 2 }}
          required
          helperText="Use your government-issued email address"
        />
        
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={officialLogin.password}
          onChange={(e) => setOfficialLogin(prev => ({ ...prev, password: e.target.value }))}
          sx={{ mb: 2 }}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant={officialLogin.userType === UserRole.GOVERNMENT_OFFICIAL ? 'contained' : 'outlined'}
              onClick={() => setOfficialLogin(prev => ({ ...prev, userType: UserRole.GOVERNMENT_OFFICIAL }))}
              startIcon={<AccountBalance />}
              size="small"
            >
              Government Official
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant={officialLogin.userType === UserRole.DEPARTMENT_HEAD ? 'contained' : 'outlined'}
              onClick={() => setOfficialLogin(prev => ({ ...prev, userType: UserRole.DEPARTMENT_HEAD }))}
              startIcon={<Business />}
              size="small"
            >
              Department Head
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant={officialLogin.userType === UserRole.REGISTRAR ? 'contained' : 'outlined'}
              onClick={() => setOfficialLogin(prev => ({ ...prev, userType: UserRole.REGISTRAR }))}
              startIcon={<AccountBalance />}
              size="small"
            >
              Registrar
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant={officialLogin.userType === UserRole.FINANCIAL_INSTITUTION ? 'contained' : 'outlined'}
              onClick={() => setOfficialLogin(prev => ({ ...prev, userType: UserRole.FINANCIAL_INSTITUTION }))}
              startIcon={<Business />}
              size="small"
            >
              Financial Institution
            </Button>
          </Grid>
        </Grid>

        <FormControlLabel
          control={
            <Checkbox
              checked={officialLogin.rememberMe}
              onChange={(e) => setOfficialLogin(prev => ({ ...prev, rememberMe: e.target.checked }))}
            />
          }
          label="Remember me on this device"
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <Security />}
          onClick={() => handleLogin(officialLogin)}
          disabled={loading || !officialLogin.email || !officialLogin.password}
          sx={{ mb: 2 }}
        >
          {loading ? 'Authenticating...' : 'Secure Login'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Need access?{' '}
            <Link to="/contact" style={{ color: '#00D4FF', textDecoration: 'none' }}>
              Contact Administrator
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
            Welcome to BhoomiChain
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Secure blockchain-based land registry system
          </Typography>
        </Box>

        <Paper sx={{ maxWidth: 500, mx: 'auto', p: 0, overflow: 'hidden' }}>
          {/* Tabs */}
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              label="Citizens"
              icon={<Person />}
              iconPosition="start"
            />
            <Tab
              label="Officials"
              icon={<Business />}
              iconPosition="start"
            />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 4 }}>
            <TabPanel value={currentTab} index={0}>
              {renderCitizenLogin()}
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              {renderOfficialLogin()}
            </TabPanel>
          </Box>
        </Paper>

        {/* Features */}
        <Grid container spacing={2} sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Security sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Secure & Transparent
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Blockchain-based security
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <VerifiedUser sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Verified Records
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Immutable land records
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <AccountBalance sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Government Backed
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Official registry system
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Help */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="text"
            startIcon={<Help />}
            onClick={() => {}}
          >
            Need Help?
          </Button>
        </Box>
      </Box>

      {/* Wallet Connect Dialog */}
      <Dialog open={walletConnectDialog} onClose={() => setWalletConnectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Wallet sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6">Connect Your Wallet</Typography>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
            Connect your crypto wallet to access BhoomiChain securely
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleWalletConnect}
                disabled={loading}
                sx={{ p: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'orange',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white' }}>M</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1">MetaMask</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Connect using browser wallet
                    </Typography>
                  </Box>
                </Box>
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => {}}
                sx={{ p: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <QrCode sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body1">WalletConnect</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Scan with your mobile wallet
                    </Typography>
                  </Box>
                </Box>
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setWalletConnectDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginPage;
