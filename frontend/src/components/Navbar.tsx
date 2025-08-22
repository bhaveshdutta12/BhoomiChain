import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Home,
  Search,
  Map,
  Dashboard,
  Add,
  SwapHoriz,
  AccountCircle,
  Menu as MenuIcon,
  Wallet,
  Logout,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3();
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const getMenuItems = () => {
    const baseItems = [
      { label: 'Home', path: '/', icon: <Home /> },
      { label: 'Search', path: '/search', icon: <Search /> },
      { label: 'Map View', path: '/map', icon: <Map /> },
    ];

    if (isAuthenticated) {
      if (hasRole(UserRole.GOVERNMENT_OFFICIAL) || 
          hasRole(UserRole.DEPARTMENT_HEAD) || 
          hasRole(UserRole.REGISTRAR) || 
          hasRole(UserRole.ADMIN)) {
        baseItems.push(
          { label: 'Government Dashboard', path: '/government-dashboard', icon: <Dashboard /> }
        );
      } else {
        baseItems.push(
          { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> }
        );
      }

      if (hasRole(UserRole.REGISTRAR) || hasRole(UserRole.ADMIN)) {
        baseItems.push(
          { label: 'Register Land', path: '/register-land', icon: <Add /> }
        );
      }

      baseItems.push(
        { label: 'Transfers', path: '/transfers', icon: <SwapHoriz /> }
      );
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          BhoomiChain
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              cursor: 'pointer',
              bgcolor: location.pathname === item.path ? 'action.selected' : 'transparent',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary', zIndex: 2000 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              🏡 BhoomiChain
            </Typography>
            <Chip
              label="BETA"
              size="small"
              color="secondary"
              sx={{ ml: 1, fontSize: '0.75rem' }}
            />
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    bgcolor: location.pathname === item.path ? 'action.selected' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated ? (
              <>
                {isConnected && (
                  <Chip
                    icon={<Wallet />}
                    label={formatAddress(account || '')}
                    color="primary"
                    variant="outlined"
                    size="medium"
                  />
                )}
                <Chip
                  icon={<AccountCircle />}
                  label={user?.name || 'User'}
                  color="secondary"
                  variant="outlined"
                  size="medium"
                />
                <IconButton
                  color="inherit"
                  onClick={handleMenuClick}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => navigate('/profile')}>
                    <AccountCircle sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  {isConnected && (
                    <MenuItem onClick={disconnectWallet}>
                      <Wallet sx={{ mr: 1 }} />
                      Disconnect Wallet
                    </MenuItem>
                  )}
                  <MenuItem onClick={logout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {!isConnected && (
                  <Button
                    variant="outlined"
                    startIcon={<Wallet />}
                    onClick={connectWallet}
                    sx={{ mr: 1 }}
                  >
                    Connect Wallet
                  </Button>
                )}
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
