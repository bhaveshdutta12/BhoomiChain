import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
  OutlinedInput
} from '@mui/material';
import {
  Person,
  Business,
  Visibility,
  VisibilityOff,
  AccountBalance,
  VerifiedUser,
  Security,
  AccountTree,
  CheckCircle,
  ArrowForward,
  ArrowBack
} from '@mui/icons-material';
import { UserRole } from '../types';

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
      id={`registration-tabpanel-${index}`}
      aria-labelledby={`registration-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

interface RegistrationForm {
  // Basic Information
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  
  // Role-specific Information
  userType: UserRole;
  department?: string;
  institution?: string;
  designation?: string;
  employeeId?: string;
  
  // Additional Information
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  // Terms and Conditions
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

const UserRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState<RegistrationForm>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: UserRole.CITIZEN,
    department: '',
    institution: '',
    designation: '',
    employeeId: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    acceptTerms: false,
    acceptPrivacy: false
  });

  const steps = ['Basic Information', 'Role Details', 'Address & Contact', 'Terms & Conditions'];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (field: keyof RegistrationForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Information
        return !!(formData.email && formData.password && formData.confirmPassword && 
                 formData.firstName && formData.lastName && formData.phone);
      case 1: // Role Details
        if (formData.userType === UserRole.CITIZEN) return true;
        return !!(formData.department || formData.institution);
      case 2: // Address & Contact
        return !!(formData.address && formData.city && formData.state && formData.pincode);
      case 3: // Terms & Conditions
        return formData.acceptTerms && formData.acceptPrivacy;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    } else {
      setError('Please fill in all required fields for this step.');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setError('Please complete all steps and accept terms and conditions.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        role: formData.userType,
        department: formData.department,
        institution: formData.institution,
        isActive: true,
        permissions: [],
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      const success = await register(userData);
      
      if (success) {
        setSuccess('Registration successful! You are now logged in.');
        setTimeout(() => {
          // Navigate based on user type
          if (formData.userType === UserRole.CITIZEN) {
            navigate('/dashboard');
          } else if (formData.userType === UserRole.GOVERNMENT_OFFICIAL || 
                     formData.userType === UserRole.DEPARTMENT_HEAD || 
                     formData.userType === UserRole.REGISTRAR) {
            navigate('/government-dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 2000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInformation = () => (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            required
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderRoleDetails = () => (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>User Type</InputLabel>
            <Select
              value={formData.userType}
              onChange={(e) => handleInputChange('userType', e.target.value as UserRole)}
              label="User Type"
            >
              <MenuItem value={UserRole.CITIZEN}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person />
                  Citizen
                </Box>
              </MenuItem>
              <MenuItem value={UserRole.GOVERNMENT_OFFICIAL}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance />
                  Government Official
                </Box>
              </MenuItem>
              <MenuItem value={UserRole.DEPARTMENT_HEAD}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountTree />
                  Department Head
                </Box>
              </MenuItem>
              <MenuItem value={UserRole.FINANCIAL_INSTITUTION}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance />
                  Financial Institution
                </Box>
              </MenuItem>
              <MenuItem value={UserRole.REGISTRAR}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VerifiedUser />
                  Registrar
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {formData.userType !== UserRole.CITIZEN && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department/Institution"
                value={formData.department || formData.institution}
                onChange={(e) => {
                  if (formData.userType === UserRole.FINANCIAL_INSTITUTION) {
                    handleInputChange('institution', e.target.value);
                  } else {
                    handleInputChange('department', e.target.value);
                  }
                }}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Designation"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                variant="outlined"
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );

  const renderAddressContact = () => (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            required
            multiline
            rows={3}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Pincode"
            value={formData.pincode}
            onChange={(e) => handleInputChange('pincode', e.target.value)}
            required
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderTermsConditions = () => (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.acceptTerms}
                onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                color="primary"
              />
            }
            label="I accept the Terms and Conditions"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.acceptPrivacy}
                onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
                color="primary"
              />
            }
            label="I accept the Privacy Policy"
          />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            By registering, you agree to our terms and conditions. Your information will be securely stored and used only for the purposes of land registry management.
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderRoleDetails();
      case 2:
        return renderAddressContact();
      case 3:
        return renderTermsConditions();
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          User Registration
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Join BhoomiChain - Secure Land Registry Platform
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab
            icon={<Person />}
            label="Citizen"
            iconPosition="start"
          />
          <Tab
            icon={<AccountBalance />}
            label="Government"
            iconPosition="start"
          />
          <Tab
            icon={<Business />}
            label="Institution"
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Citizen Registration
            </Typography>
            <Typography color="text.secondary">
              Register as a citizen to access land registry services
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <AccountBalance sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Government Official Registration
            </Typography>
            <Typography color="text.secondary">
              Register as a government official or department head
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Business sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Institution Registration
            </Typography>
            <Typography color="text.secondary">
              Register as a financial institution or registrar
            </Typography>
          </Box>
        </TabPanel>

        <Divider sx={{ my: 3 }} />

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                size="large"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                size="large"
              >
                Next
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserRegistrationPage;
