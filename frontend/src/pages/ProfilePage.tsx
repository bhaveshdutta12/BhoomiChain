import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Person,
  Edit,
  Settings,
  History,
  Home,
  Verified,
  LocationOn,
  Phone,
  Email,
  AccountBalance,
  Notifications,
  Security,
  Language,
  Palette,
  Save,
  Camera,
  MoreVert,
  TrendingUp,
  Assessment,
  Receipt,
  Description,
  CalendarToday,
  MonetizationOn,
  ExpandMore,
  ContentCopy,
  Visibility,
  VisibilityOff,
  Lock,
  Key,
  Shield,
  CheckCircle,
  Warning,
  Info,
  Link
} from '@mui/icons-material';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  walletAddress: string;
  isVerified: boolean;
  memberSince: string;
  profileImage?: string;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'not_started';
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
    emailUpdates: boolean;
  };
}

interface OwnedLand {
  id: string;
  surveyNumber: string;
  address: string;
  area: number;
  areaUnit: string;
  landType: string;
  estimatedValue: number;
  registrationDate: string;
  status: 'owned' | 'pending_transfer' | 'disputed';
}

interface Transaction {
  id: string;
  type: 'registration' | 'transfer' | 'verification';
  description: string;
  amount?: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  blockchainTx?: string;
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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Mock user data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user_001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 98765 43210',
    address: 'Sector 15, Noida, Uttar Pradesh, India',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    isVerified: true,
    memberSince: '2022-03-15',
    kycStatus: 'verified',
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'English',
      emailUpdates: true
    }
  });

  const mockOwnedLands: OwnedLand[] = [
    {
      id: 'LAND-001',
      surveyNumber: 'SUR-001-2024',
      address: 'Sector 15, Noida, UP',
      area: 2400,
      areaUnit: 'sqft',
      landType: 'Residential',
      estimatedValue: 5200000,
      registrationDate: '2023-06-15',
      status: 'owned'
    },
    {
      id: 'LAND-002',
      surveyNumber: 'SUR-002-2024',
      address: 'Village Khera, Noida, UP',
      area: 10800,
      areaUnit: 'sqft',
      landType: 'Agricultural',
      estimatedValue: 1500000,
      registrationDate: '2024-01-20',
      status: 'pending_transfer'
    }
  ];

  const mockTransactions: Transaction[] = [
    {
      id: 'TXN-001',
      type: 'registration',
      description: 'Land Registration - SUR-001-2024',
      amount: 50000,
      date: '2024-08-20',
      status: 'completed',
      blockchainTx: '0xabc123...def456'
    },
    {
      id: 'TXN-002',
      type: 'transfer',
      description: 'Transfer Request - SUR-002-2024',
      date: '2024-08-18',
      status: 'pending'
    },
    {
      id: 'TXN-003',
      type: 'verification',
      description: 'KYC Verification',
      amount: 1000,
      date: '2024-08-15',
      status: 'completed',
      blockchainTx: '0x789xyz...123abc'
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSaveProfile = () => {
    // Save profile changes
    setEditMode(false);
    // Show success message
  };

  const handlePreferenceChange = (key: keyof UserProfile['preferences'], value: any) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'not_started': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'owned': return 'success';
      case 'pending_transfer': return 'warning';
      case 'disputed': return 'error';
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const renderProfileTab = () => (
    <Grid container spacing={3}>
      {/* Profile Header */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    <Camera fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {userProfile.name.charAt(0)}
                </Avatar>
              </Badge>
              
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {userProfile.name}
                  </Typography>
                  {userProfile.isVerified && (
                    <Verified color="primary" />
                  )}
                </Box>
                
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Member since {new Date(userProfile.memberSince).toLocaleDateString()}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={`KYC ${userProfile.kycStatus.toUpperCase()}`}
                    color={getKycStatusColor(userProfile.kycStatus) as any}
                    size="small"
                  />
                  <Chip
                    label={`${mockOwnedLands.length} Properties`}
                    color="info"
                    size="small"
                  />
                </Box>
                
                <Button
                  variant={editMode ? "contained" : "outlined"}
                  startIcon={editMode ? <Save /> : <Edit />}
                  onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
                  color={editMode ? "success" : "primary"}
                >
                  {editMode ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!editMode}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Email Address"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!editMode}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!editMode}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Address"
                  value={userProfile.address}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!editMode}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Wallet Address
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                        flexGrow: 1
                      }}
                    >
                      {showWallet 
                        ? userProfile.walletAddress 
                        : `${userProfile.walletAddress.substring(0, 6)}...${userProfile.walletAddress.substring(38)}`
                      }
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setShowWallet(!showWallet)}
                    >
                      {showWallet ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(userProfile.walletAddress)}
                    >
                      <ContentCopy />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Account Statistics */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Home sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {mockOwnedLands.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Properties Owned
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <MonetizationOn sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(mockOwnedLands.reduce((sum, land) => sum + land.estimatedValue, 0))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Portfolio Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Receipt sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {mockTransactions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  92%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Profile Completion
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderLandsTab = () => (
    <Grid container spacing={3}>
      {mockOwnedLands.map((land) => (
        <Grid item xs={12} md={6} key={land.id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  {land.surveyNumber}
                </Typography>
                <Chip
                  label={land.status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor(land.status) as any}
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <LocationOn fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                {land.address}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Area:</strong> {land.area.toLocaleString()} {land.areaUnit}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Type:</strong> {land.landType}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Registered:</strong> {new Date(land.registrationDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Value:</strong> {formatCurrency(land.estimatedValue)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Button variant="outlined" size="small" fullWidth>
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTransactionsTab = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Transaction History
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.type.toUpperCase()}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    {transaction.amount ? formatCurrency(transaction.amount) : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status.toUpperCase()}
                      color={getStatusColor(transaction.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderSettingsTab = () => (
    <Grid container spacing={3}>
      {/* Security Settings */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ mr: 1 }} color="primary" />
              Security Settings
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <Lock />
                </ListItemIcon>
                <ListItemText 
                  primary="Change Password"
                  secondary="Update your account password"
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setChangePasswordDialog(true)}
                >
                  Change
                </Button>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Key />
                </ListItemIcon>
                <ListItemText 
                  primary="Two-Factor Authentication"
                  secondary="Add an extra layer of security"
                />
                <Switch defaultChecked />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Shield />
                </ListItemIcon>
                <ListItemText 
                  primary="Wallet Security"
                  secondary="Enable wallet transaction confirmation"
                />
                <Switch defaultChecked />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Notification Preferences */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Notifications sx={{ mr: 1 }} color="primary" />
              Notifications
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Email Notifications"
                  secondary="Receive updates via email"
                />
                <Switch
                  checked={userProfile.preferences.emailUpdates}
                  onChange={(e) => handlePreferenceChange('emailUpdates', e.target.checked)}
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Push Notifications"
                  secondary="Browser push notifications"
                />
                <Switch
                  checked={userProfile.preferences.notifications}
                  onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Transaction Alerts"
                  secondary="Immediate alerts for blockchain transactions"
                />
                <Switch defaultChecked />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Property Updates"
                  secondary="Updates about your properties"
                />
                <Switch defaultChecked />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Display Preferences */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Palette sx={{ mr: 1 }} color="primary" />
              Display Preferences
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <Language />
                </ListItemIcon>
                <ListItemText 
                  primary="Language"
                  secondary="Choose your preferred language"
                />
                <TextField
                  select
                  size="small"
                  value={userProfile.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Hindi">हिंदी</MenuItem>
                  <MenuItem value="Bengali">বাংলা</MenuItem>
                </TextField>
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Dark Mode"
                  secondary="Switch to dark theme"
                />
                <Switch
                  checked={userProfile.preferences.darkMode}
                  onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* KYC Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Verified sx={{ mr: 1 }} color="primary" />
              KYC Verification
            </Typography>
            
            <Alert severity={userProfile.kycStatus === 'verified' ? 'success' : 'warning'} sx={{ mb: 2 }}>
              <Typography variant="body2">
                Your KYC status is <strong>{userProfile.kycStatus.toUpperCase()}</strong>
                {userProfile.kycStatus === 'verified' 
                  ? '. You can perform all transactions.'
                  : '. Complete verification to unlock all features.'
                }
              </Typography>
            </Alert>
            
            {userProfile.kycStatus !== 'verified' && (
              <Button variant="contained" fullWidth>
                Complete KYC Verification
              </Button>
            )}
            
            {userProfile.kycStatus === 'verified' && (
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 1 }} />
                <Typography variant="body2" color="success.main">
                  Verification Complete
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
          User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account information and preferences
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Profile" icon={<Person />} />
          <Tab label="My Lands" icon={<Home />} />
          <Tab label="Transactions" icon={<History />} />
          <Tab label="Settings" icon={<Settings />} />
        </Tabs>
      </Paper>

      <TabPanel value={currentTab} index={0}>
        {renderProfileTab()}
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        {renderLandsTab()}
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        {renderTransactionsTab()}
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        {renderSettingsTab()}
      </TabPanel>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordDialog}
        onClose={() => setChangePasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setChangePasswordDialog(false)}>
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Receipt sx={{ mr: 1 }} />
          Download Receipt
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Link sx={{ mr: 1 }} />
          View on Blockchain
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default ProfilePage;
