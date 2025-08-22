import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  LinearProgress,
  CircularProgress,
  Backdrop,
  Snackbar
} from '@mui/material';
import {
  CloudUpload,
  Description,
  LocationOn,
  Person,
  Check,
  Delete,
  Visibility,
  Map,
  Gavel,
  AccountBalance,
  Security,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Polygon, LayersControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/leaflet-fixes.css';

interface LandData {
  surveyNumber: string;
  ownerName: string;
  ownerAddress: string;
  ownerPhone: string;
  ownerEmail: string;
  location: string;
  area: number;
  areaUnit: 'acres' | 'hectares' | 'sqft' | 'sqm';
  landType: 'residential' | 'commercial' | 'agricultural' | 'industrial';
  marketValue: number;
  coordinates: [number, number];
  polygon?: number[][];
  district: string;
  state: string;
  pincode: string;
  documents: File[];
  additionalInfo?: string;
}

interface UploadedDocument {
  file: File;
  type: string;
  uploadDate: Date;
}

const RegisterLandPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [landData, setLandData] = useState<LandData>({
    surveyNumber: '',
    ownerName: '',
    ownerAddress: '',
    ownerPhone: '',
    ownerEmail: '',
    location: '',
    area: 0,
    areaUnit: 'acres',
    landType: 'residential',
    marketValue: 0,
    coordinates: [77.2090, 28.6139],
    district: '',
    state: '',
    pincode: '',
    documents: [],
    additionalInfo: ''
  });
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; file?: File }>({ open: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [drawPolygon, setDrawPolygon] = useState(false);
  const [tempMarker, setTempMarker] = useState<[number, number] | null>(null); // [lng, lat]
  const [tempPolygon, setTempPolygon] = useState<number[][]>([]); // [[lng, lat], ...]
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  useEffect(() => {
    try {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      });
    } catch {}
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setIsReverseGeocoding(true);
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) return;
      const data: any = await response.json();
      const address = data?.address || {};
      const nextState: string = address.state || address.region || '';
      const nextDistrict: string = address.district || address.county || address.city_district || address.city || address.town || '';
      const nextPincode: string = address.postcode || '';

      if (nextState) handleInputChange('state', nextState);
      if (nextDistrict) handleInputChange('district', nextDistrict);
      if (nextPincode) handleInputChange('pincode', nextPincode);
    } catch (e) {
      // swallow errors; fields just won't autofill
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const steps = [
    'Basic Information',
    'Owner Details',
    'Location & Mapping',
    'Document Upload',
    'Review & Submit'
  ];

  const documentTypes = [
    'Title Deed',
    'Survey Report',
    'No Objection Certificate',
    'Property Tax Receipt',
    'Building Plan',
    'Occupancy Certificate',
    'Power of Attorney',
    'Court Order',
    'Revenue Record',
    'Other'
  ];

  const stateOptions = [
    'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 
    'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Madhya Pradesh', 'Other'
  ];

  const handleInputChange = (field: keyof LandData, value: any) => {
    setLandData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const files = event.target.files;
    if (files) {
      const newDocuments: UploadedDocument[] = Array.from(files).map(file => ({
        file,
        type: documentType,
        uploadDate: new Date()
      }));
      setDocuments(prev => [...prev, ...newDocuments]);
      setLandData(prev => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(files)]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
    setLandData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepIndex) {
      case 0: // Basic Information
        if (!landData.surveyNumber) newErrors.surveyNumber = 'Survey number is required';
        if (!landData.location) newErrors.location = 'Location is required';
        if (!landData.area || landData.area <= 0) newErrors.area = 'Area must be greater than 0';
        if (!landData.marketValue || landData.marketValue <= 0) newErrors.marketValue = 'Market value is required';
        break;

      case 1: // Owner Details
        if (!landData.ownerName) newErrors.ownerName = 'Owner name is required';
        if (!landData.ownerAddress) newErrors.ownerAddress = 'Owner address is required';
        if (!landData.ownerPhone) newErrors.ownerPhone = 'Phone number is required';
        if (!landData.ownerEmail) newErrors.ownerEmail = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(landData.ownerEmail)) newErrors.ownerEmail = 'Invalid email format';
        break;

      case 2: // Location & Mapping
        if (!landData.district) newErrors.district = 'District is required';
        if (!landData.state) newErrors.state = 'State is required';
        if (!landData.pincode) newErrors.pincode = 'Pincode is required';
        if (!/^\d{6}$/.test(landData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
        break;

      case 3: // Document Upload
        if (documents.length === 0) newErrors.documents = 'At least one document is required';
        const requiredDocs = ['Title Deed', 'Survey Report'];
        const uploadedTypes = documents.map(doc => doc.type);
        const missingRequired = requiredDocs.filter(type => !uploadedTypes.includes(type));
        if (missingRequired.length > 0) {
          newErrors.documents = `Missing required documents: ${missingRequired.join(', ')}`;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleCoordinatesChange = (coords: [number, number]) => {
    handleInputChange('coordinates', coords);
  };

  const handlePolygonChange = (polygon: number[][]) => {
    handleInputChange('polygon', polygon);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulate API call for land registration
      console.log('Registering land with data:', landData);
      console.log('Documents:', documents);

      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In real implementation, this would:
      // 1. Upload documents to IPFS
      // 2. Call smart contract to register land
      // 3. Save metadata to backend database

      setSubmitSuccess(true);
      setActiveStep(prev => prev + 1);
    } catch (error) {
      setSubmitError('Failed to register land. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBasicInfoStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Survey Number"
          value={landData.surveyNumber}
          onChange={(e) => handleInputChange('surveyNumber', e.target.value)}
          error={!!errors.surveyNumber}
          helperText={errors.surveyNumber || 'Unique survey number for the land'}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Location"
          value={landData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          error={!!errors.location}
          helperText={errors.location || 'General location description'}
          required
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Area"
          type="number"
          value={landData.area}
          onChange={(e) => handleInputChange('area', Number(e.target.value))}
          error={!!errors.area}
          helperText={errors.area}
          required
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Area Unit</InputLabel>
          <Select
            value={landData.areaUnit}
            label="Area Unit"
            onChange={(e) => handleInputChange('areaUnit', e.target.value)}
          >
            <MenuItem value="acres">Acres</MenuItem>
            <MenuItem value="hectares">Hectares</MenuItem>
            <MenuItem value="sqft">Square Feet</MenuItem>
            <MenuItem value="sqm">Square Meters</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Land Type</InputLabel>
          <Select
            value={landData.landType}
            label="Land Type"
            onChange={(e) => handleInputChange('landType', e.target.value)}
          >
            <MenuItem value="residential">Residential</MenuItem>
            <MenuItem value="commercial">Commercial</MenuItem>
            <MenuItem value="agricultural">Agricultural</MenuItem>
            <MenuItem value="industrial">Industrial</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Market Value (INR)"
          type="number"
          value={landData.marketValue}
          onChange={(e) => handleInputChange('marketValue', Number(e.target.value))}
          error={!!errors.marketValue}
          helperText={errors.marketValue || `Current value: ${formatCurrency(landData.marketValue)}`}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Additional Information"
          multiline
          rows={3}
          value={landData.additionalInfo}
          onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
          helperText="Any additional details about the property"
        />
      </Grid>
    </Grid>
  );

  const renderOwnerDetailsStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Owner information will be recorded on the blockchain and cannot be changed without proper verification.
          </Typography>
        </Alert>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Owner Full Name"
          value={landData.ownerName}
          onChange={(e) => handleInputChange('ownerName', e.target.value)}
          error={!!errors.ownerName}
          helperText={errors.ownerName}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          value={landData.ownerEmail}
          onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
          error={!!errors.ownerEmail}
          helperText={errors.ownerEmail}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Phone Number"
          value={landData.ownerPhone}
          onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
          error={!!errors.ownerPhone}
          helperText={errors.ownerPhone}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Owner Address"
          multiline
          rows={3}
          value={landData.ownerAddress}
          onChange={(e) => handleInputChange('ownerAddress', e.target.value)}
          error={!!errors.ownerAddress}
          helperText={errors.ownerAddress}
          required
        />
      </Grid>
    </Grid>
  );

  const renderLocationStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Autocomplete
          options={stateOptions}
          value={landData.state}
          onChange={(_, newValue) => handleInputChange('state', newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="State"
              error={!!errors.state}
              helperText={errors.state}
              required
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="District"
          value={landData.district}
          onChange={(e) => handleInputChange('district', e.target.value)}
          error={!!errors.district}
          helperText={errors.district}
          required
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Pincode"
          value={landData.pincode}
          onChange={(e) => handleInputChange('pincode', e.target.value)}
          error={!!errors.pincode}
          helperText={errors.pincode}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Land Coordinates</Typography>
              <Button
                startIcon={<Map />}
                onClick={() => setMapDialogOpen(true)}
                variant="outlined"
              >
                Select on Map
              </Button>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  type="number"
                  value={landData.coordinates[1]}
                  onChange={(e) => handleCoordinatesChange([landData.coordinates[0], Number(e.target.value)])}
                  inputProps={{ step: 0.000001 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  type="number"
                  value={landData.coordinates[0]}
                  onChange={(e) => handleCoordinatesChange([Number(e.target.value), landData.coordinates[1]])}
                  inputProps={{ step: 0.000001 }}
                />
              </Grid>
            </Grid>
            {landData.polygon && landData.polygon.length > 0 && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Land boundary polygon defined with {landData.polygon.length} points
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderDocumentStep = () => (
    <Box>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Required Documents:</strong> Title Deed, Survey Report
          <br />
          <strong>Optional:</strong> NOC, Tax Receipts, Building Plans, etc.
        </Typography>
      </Alert>
      
      {errors.documents && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.documents}
        </Alert>
      )}

      <Grid container spacing={2}>
        {documentTypes.map((docType, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {docType}
                  {['Title Deed', 'Survey Report'].includes(docType) && (
                    <Chip label="Required" color="error" size="small" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => handleFileUpload(e, docType)}
                  style={{ display: 'none' }}
                  id={`file-upload-${index}`}
                />
                <label htmlFor={`file-upload-${index}`}>
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    fullWidth
                  >
                    Upload {docType}
                  </Button>
                </label>
                
                {/* Show uploaded files for this type */}
                {documents.filter(doc => doc.type === docType).map((doc, docIndex) => (
                  <Box key={docIndex} sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description fontSize="small" />
                    <Typography variant="caption" sx={{ flexGrow: 1 }}>
                      {doc.file.name}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => setPreviewDialog({ open: true, file: doc.file })}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => removeDocument(documents.indexOf(doc))}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {documents.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Uploaded Documents ({documents.length})
            </Typography>
            <List>
              {documents.map((doc, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Description />
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.file.name}
                    secondary={`${doc.type} • ${(doc.file.size / 1024 / 1024).toFixed(2)} MB • ${doc.uploadDate.toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => removeDocument(index)} color="error">
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const renderReviewStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Please review all information carefully. Once submitted, this land will be registered on the blockchain and cannot be easily modified.
          </Typography>
        </Alert>
      </Grid>
      
      {/* Basic Information Review */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              <Gavel sx={{ mr: 1, verticalAlign: 'middle' }} />
              Basic Information
            </Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              <Typography><strong>Survey Number:</strong> {landData.surveyNumber}</Typography>
              <Typography><strong>Location:</strong> {landData.location}</Typography>
              <Typography><strong>Area:</strong> {landData.area} {landData.areaUnit}</Typography>
              <Typography><strong>Type:</strong> {landData.landType}</Typography>
              <Typography><strong>Value:</strong> {formatCurrency(landData.marketValue)}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Owner Information Review */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="secondary">
              <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
              Owner Information
            </Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              <Typography><strong>Name:</strong> {landData.ownerName}</Typography>
              <Typography><strong>Email:</strong> {landData.ownerEmail}</Typography>
              <Typography><strong>Phone:</strong> {landData.ownerPhone}</Typography>
              <Typography><strong>Address:</strong> {landData.ownerAddress}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Location Review */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="success.main">
              <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
              Location Details
            </Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              <Typography><strong>State:</strong> {landData.state}</Typography>
              <Typography><strong>District:</strong> {landData.district}</Typography>
              <Typography><strong>Pincode:</strong> {landData.pincode}</Typography>
              <Typography><strong>Coordinates:</strong> {landData.coordinates[1].toFixed(6)}, {landData.coordinates[0].toFixed(6)}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Documents Review */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="warning.main">
              <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
              Documents ({documents.length})
            </Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              {documents.map((doc, index) => (
                <Typography key={index}>
                  <strong>{doc.type}:</strong> {doc.file.name}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSuccessStep = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Land Registered Successfully!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Your land has been successfully registered on the BhoomiChain blockchain.
        Transaction details have been sent to your email.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" onClick={() => window.location.href = '/dashboard'}>
          Go to Dashboard
        </Button>
        <Button variant="outlined" onClick={() => window.location.href = '/'}>
          Back to Home
        </Button>
      </Box>
    </Box>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInfoStep();
      case 1:
        return renderOwnerDetailsStep();
      case 2:
        return renderLocationStep();
      case 3:
        return renderDocumentStep();
      case 4:
        return renderReviewStep();
      case 5:
        return renderSuccessStep();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
          Register New Land
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Register your land property on the blockchain for secure ownership verification
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              <StepLabel>
                {label}
                {index < activeStep && <Check sx={{ ml: 1, color: 'success.main' }} />}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 4, mb: 3, minHeight: '400px' }}>
        {getStepContent(activeStep)}
      </Paper>

      {/* Navigation Buttons */}
      {activeStep < 5 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep === 4 ? (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <Security />}
              >
                {isSubmitting ? 'Registering...' : 'Register Land'}
              </Button>
            ) : (
              <Button onClick={handleNext} variant="contained">
                Next
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Submit Error */}
      {submitError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {submitError}
        </Alert>
      )}

      {/* Loading Backdrop */}
      <Backdrop
        open={isSubmitting}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} sx={{ mb: 2 }} />
          <Typography variant="h6">
            Registering Land on Blockchain...
          </Typography>
          <Typography variant="body2">
            This may take a few moments
          </Typography>
        </Box>
      </Backdrop>

      {/* Map Dialog */}
      <Dialog
        open={mapDialogOpen}
        onClose={() => setMapDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Select Land Location</DialogTitle>
        <DialogContent>
          <Box sx={{ height: '60vh', mt: 2 }}>
            <Box sx={{ height: '100%', position: 'relative' }}>
              <MapContainer
                center={[landData.coordinates[1], landData.coordinates[0]]}
                zoom={12}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom
              >
                <LayersControl position="topright">
                  <LayersControl.BaseLayer checked name="Street Map">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer name="Satellite">
                    <TileLayer
                      attribution='Imagery © <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>

                <MapClick onClick={(lat, lng) => {
                  if (drawPolygon) {
                    setTempPolygon(prev => [...prev, [lng, lat]]);
                  } else {
                    setTempMarker([lng, lat]);
                  }
                }} />

                {(tempMarker || landData.coordinates) && (
                  <Marker position={[(tempMarker?.[1] ?? landData.coordinates[1]), (tempMarker?.[0] ?? landData.coordinates[0])]} />
                )}

                {(tempPolygon.length >= 3 || (landData.polygon && landData.polygon.length >= 3)) && (
                  <Polygon
                    positions={(tempPolygon.length >= 3 ? tempPolygon : (landData.polygon as number[][])).map(p => [p[1], p[0]])}
                    pathOptions={{ color: '#00B894', fillColor: '#00B894', fillOpacity: 0.25, weight: 2 }}
                  />
                )}
              </MapContainer>

              <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 1200, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={drawPolygon ? 'Drawing Polygon: ON' : 'Drawing Polygon: OFF'} color={drawPolygon ? 'success' : 'default'} />
                <Button size="small" variant="outlined" onClick={() => setDrawPolygon(p => !p)}>
                  {drawPolygon ? 'Stop Drawing' : 'Draw Polygon'}
                </Button>
                <Button size="small" variant="outlined" onClick={() => { setTempPolygon([]); }} disabled={!drawPolygon && tempPolygon.length === 0}>
                  Clear Polygon
                </Button>
                <Button size="small" variant="outlined" onClick={() => setTempMarker(null)} disabled={!tempMarker}>
                  Clear Pin
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMapDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              if (tempMarker) {
                handleCoordinatesChange([tempMarker[0], tempMarker[1]]);
                reverseGeocode(tempMarker[1], tempMarker[0]);
              }
              if (tempPolygon.length >= 3) {
                handlePolygonChange(tempPolygon);
              }
              setMapDialogOpen(false);
            }}
            variant="contained"
          >
            {isReverseGeocoding ? 'Updating address…' : 'Confirm Location'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Document Preview</DialogTitle>
        <DialogContent>
          {previewDialog.file && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Description sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6">{previewDialog.file.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {(previewDialog.file.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog({ open: false })}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RegisterLandPage;

// Utility component to capture map clicks
function MapClick({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}
