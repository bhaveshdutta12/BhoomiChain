import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Layers as LayersIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polygon, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/leaflet-fixes.css';

interface LandParcel {
  id: string;
  title: string;
  coordinates: [number, number];
  boundaries: number[][];
  area: number;
  registrationDate: string;
  currentOwner: string;
  value: string;
  status: 'owned' | 'pending' | 'transferred';
  documents: string[];
}

const MapPage: React.FC = () => {
  const [landParcels, setLandParcels] = useState<LandParcel[]>([]);
  const [selectedLand, setSelectedLand] = useState<LandParcel | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUserLands, setShowUserLands] = useState(true);
  
  // Cleanup on unmount to prevent navigation issues
  useEffect(() => {
    return () => {
      // Close any open dialogs/drawers when component unmounts
      setDetailsOpen(false);
      setDrawerOpen(false);
      setSelectedLand(null);
    };
  }, []);
  
  // Default map center (New Delhi coordinates)
  const defaultCenter: [number, number] = [28.7041, 77.1025];
  const defaultZoom = 10;
  
  // Create custom marker icon
  useEffect(() => {
    // Fix Leaflet default markers
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });

    // Cleanup function to reset any global Leaflet state
    return () => {
      // Clean up any global event listeners that might interfere with navigation
      if (window.L && window.L.DomEvent) {
        // Remove any global event listeners that might have been attached
      }
    };
  }, []);

  // Mock user's land data - replace with actual API call
  useEffect(() => {
    const mockLandParcels: LandParcel[] = [
      {
        id: '1',
        title: 'Residential Plot - Sector 15',
        coordinates: [77.1025, 28.7041],
        boundaries: [
          [77.1020, 28.7045],
          [77.1030, 28.7045],
          [77.1030, 28.7037],
          [77.1020, 28.7037],
        ],
        area: 2400, // sq ft
        registrationDate: '2023-06-15',
        currentOwner: 'Current User',
        value: '₹85,00,000',
        status: 'owned',
        documents: ['sale_deed.pdf', 'property_card.pdf'],
      },
      {
        id: '2',
        title: 'Commercial Land - IT Park',
        coordinates: [77.0900, 28.6950],
        boundaries: [
          [77.0895, 28.6955],
          [77.0905, 28.6955],
          [77.0905, 28.6945],
          [77.0895, 28.6945],
        ],
        area: 5000, // sq ft
        registrationDate: '2022-12-10',
        currentOwner: 'Current User',
        value: '₹2,50,00,000',
        status: 'owned',
        documents: ['commercial_deed.pdf', 'noc.pdf'],
      },
      {
        id: '3',
        title: 'Agricultural Land - Village Khera',
        coordinates: [77.1200, 28.7200],
        boundaries: [
          [77.1190, 28.7210],
          [77.1210, 28.7210],
          [77.1210, 28.7190],
          [77.1190, 28.7190],
        ],
        area: 10800, // sq ft (quarter acre)
        registrationDate: '2024-01-20',
        currentOwner: 'Current User',
        value: '₹15,00,000',
        status: 'pending',
        documents: ['mutation_record.pdf'],
      },
    ];

    setTimeout(() => {
      setLandParcels(mockLandParcels);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLandClick = (land: LandParcel) => {
    setSelectedLand(land);
    setDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'owned':
        return '#00B894';
      case 'pending':
        return '#FDCB6E';
      case 'transferred':
        return '#E84393';
      default:
        return '#B8BCC8';
    }
  };

  // Create custom icon for different land statuses
  const createCustomIcon = (status: string) => {
    const iconHtml = `
      <div style="
        background-color: ${getStatusColor(status)};
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">
        <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `;
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  // No need for API tokens with OpenStreetMap + Leaflet!

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading your land parcels...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Land Map View
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={showUserLands ? 'contained' : 'outlined'}
            startIcon={<HomeIcon />}
            onClick={() => setShowUserLands(!showUserLands)}
          >
            My Lands ({landParcels.length})
          </Button>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <LayersIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Map Container */}
      <Card sx={{ height: '70vh', overflow: 'hidden', mb: 3, position: 'relative', zIndex: 0 }}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
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
          
          {/* User's Land Parcels */}
          {showUserLands && landParcels.map((land) => (
            <React.Fragment key={land.id}>
              {/* Land Boundary Polygon */}
              <Polygon
                positions={land.boundaries.map(coord => [coord[1], coord[0]])} // Leaflet uses [lat, lng] format
                pathOptions={{
                  fillColor: getStatusColor(land.status),
                  fillOpacity: 0.3,
                  color: getStatusColor(land.status),
                  weight: 3,
                  opacity: 0.8,
                }}
              />
              
              {/* Land Marker */}
              <Marker
                position={[land.coordinates[1], land.coordinates[0]]} // Leaflet uses [lat, lng] format
                icon={createCustomIcon(land.status)}
                eventHandlers={{
                  click: () => handleLandClick(land),
                }}
              >
                <Popup>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="h6" gutterBottom>
                      {land.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Area: {land.area.toLocaleString()} sq ft
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Value: {land.value}
                    </Typography>
                    <Chip
                      label={land.status.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(land.status),
                        color: 'white',
                        fontSize: '0.7rem',
                        mt: 1
                      }}
                    />
                    <Box sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleLandClick(land)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </Card>

      {/* Legends and Land Summary */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <Chip label="Owned" size="small" sx={{ bgcolor: getStatusColor('owned'), color: 'white' }} />
        <Chip label="Pending" size="small" sx={{ bgcolor: getStatusColor('pending'), color: 'white' }} />
        <Chip label="Transferred" size="small" sx={{ bgcolor: getStatusColor('transferred'), color: 'white' }} />
      </Box>

      {/* Land Summary Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                {landParcels.filter(l => l.status === 'owned').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Owned Properties
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                {landParcels.filter(l => l.status === 'pending').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Pending Transfers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {landParcels.reduce((sum, land) => sum + land.area, 0).toLocaleString()}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Area (sq ft)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Side Drawer for Land List */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 350, bgcolor: 'background.default' }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Your Land Parcels</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List>
          {landParcels.map((land) => (
            <ListItem
              key={land.id}
              button
              onClick={() => {
                handleLandClick(land);
                setDrawerOpen(false);
              }}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    bgcolor: getStatusColor(land.status),
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={land.title}
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">
                      Area: {land.area.toLocaleString()} sq ft
                    </Typography>
                    <Typography variant="caption" display="block">
                      Value: {land.value}
                    </Typography>
                    <Chip
                      label={land.status.toUpperCase()}
                      size="small"
                      sx={{ 
                        mt: 0.5,
                        bgcolor: getStatusColor(land.status),
                        color: 'white',
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Land Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedLand && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedLand.title}</Typography>
              <IconButton onClick={() => setDetailsOpen(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Area
                      </Typography>
                      <Typography variant="body1">
                        {selectedLand.area.toLocaleString()} sq ft
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssessmentIcon sx={{ mr: 1, color: 'success.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Current Value
                      </Typography>
                      <Typography variant="body1">
                        {selectedLand.value}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon sx={{ mr: 1, color: 'warning.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Registration Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedLand.registrationDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Current Owner
                      </Typography>
                      <Typography variant="body1">
                        {selectedLand.currentOwner}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Status
                  </Typography>
                  <Chip
                    label={selectedLand.status.toUpperCase()}
                    sx={{
                      bgcolor: getStatusColor(selectedLand.status),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Coordinates
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latitude: {selectedLand.coordinates[1]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Longitude: {selectedLand.coordinates[0]}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Documents ({selectedLand.documents.length})
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedLand.documents.map((doc, index) => (
                      <Chip
                        key={index}
                        label={doc}
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          // Handle document download
                          console.log('Download document:', doc);
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              <Button variant="contained" color="primary">
                Transfer Ownership
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MapPage;
