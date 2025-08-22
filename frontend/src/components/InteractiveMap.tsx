import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Box, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  useTheme,
  useMediaQuery,
  IconButton,
  Fab
} from '@mui/material';
import { 
  LocationOn, 
  Info, 
  VerifiedUser, 
  MyLocation,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';

interface LandProperty {
  id: string;
  surveyNumber: string;
  owner: string;
  ownerName?: string;
  location: string;
  area: number;
  coordinates: [number, number];
  polygon?: number[][];
  status: 'Verified' | 'Pending' | 'Disputed';
  price: number;
  registrationDate: string;
  lastTransactionHash?: string;
  documents?: string[];
  isOwned?: boolean;
}

interface InteractiveMapProps {
  userAddress?: string;
  onLandSelect?: (land: LandProperty) => void;
  showUserLandsOnly?: boolean;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  userAddress, 
  onLandSelect, 
  showUserLandsOnly = false 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedLand, setSelectedLand] = useState<LandProperty | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lands, setLands] = useState<LandProperty[]>([]);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Default map center (Delhi coordinates)
  const defaultCenter: [number, number] = [28.6139, 77.2090];
  const defaultZoom = isMobile ? 10 : 12; // Lower zoom for mobile

  // Fix Leaflet default markers
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }, []);

  // Mock data - replace with actual API calls
  const mockLands: LandProperty[] = [
    {
      id: '1',
      surveyNumber: 'SUR-001-2024',
      owner: userAddress || '0x1234...5678',
      ownerName: 'John Doe',
      location: 'Downtown District, Block A',
      area: 2.5,
      coordinates: [77.2090, 28.6139],
      polygon: [
        [77.2080, 28.6135],
        [77.2100, 28.6135],
        [77.2100, 28.6143],
        [77.2080, 28.6143],
        [77.2080, 28.6135]
      ],
      status: 'Verified',
      price: 5000000,
      registrationDate: '2024-01-15',
      lastTransactionHash: '0xabc123...',
      documents: ['deed.pdf', 'survey.pdf'],
      isOwned: true
    },
    {
      id: '2',
      surveyNumber: 'SUR-002-2024',
      owner: '0x9876...4321',
      ownerName: 'Jane Smith',
      location: 'Green Valley, Sector 12',
      area: 1.8,
      coordinates: [77.2190, 28.6239],
      polygon: [
        [77.2180, 28.6235],
        [77.2200, 28.6235],
        [77.2200, 28.6243],
        [77.2180, 28.6243],
        [77.2180, 28.6235]
      ],
      status: 'Verified',
      price: 3500000,
      registrationDate: '2024-02-20',
      isOwned: false
    },
    {
      id: '3',
      surveyNumber: 'SUR-003-2024',
      owner: '0xabcd...efgh',
      ownerName: 'Robert Johnson',
      location: 'Industrial Zone, Block C',
      area: 3.2,
      coordinates: [77.1990, 28.6039],
      polygon: [
        [77.1980, 28.6035],
        [77.2000, 28.6035],
        [77.2000, 28.6043],
        [77.1980, 28.6043],
        [77.1980, 28.6035]
      ],
      status: 'Pending',
      price: 4200000,
      registrationDate: '2024-03-10',
      isOwned: false
    }
  ];

  useEffect(() => {
    setLands(mockLands);
  }, [userAddress]);

  const handleLandClick = (land: LandProperty) => {
    setSelectedLand(land);
    setDialogOpen(true);
    if (onLandSelect) {
      onLandSelect(land);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedLand(null);
  };

  const handleMapCreated = (map: L.Map) => {
    setMapInstance(map);
  };

  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.zoomOut();
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && mapInstance) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapInstance.setView([latitude, longitude], 15);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleFullscreen = () => {
    if (mapInstance) {
      if (!isFullscreen) {
        mapInstance.getContainer().requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', height: isMobile ? '60vh' : '70vh' }}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        whenCreated={handleMapCreated}
        zoomControl={false} // We'll add custom zoom controls
        attributionControl={true}
        doubleClickZoom={!isMobile} // Disable double-click zoom on mobile
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        boxZoom={false}
        keyboard={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {lands.map((land) => (
          <React.Fragment key={land.id}>
            <Marker
              position={land.coordinates}
              eventHandlers={{
                click: () => handleLandClick(land),
              }}
            >
              <Popup>
                <Box sx={{ minWidth: isMobile ? 200 : 250 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {land.surveyNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Owner:</strong> {land.ownerName || land.owner}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Location:</strong> {land.location}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Area:</strong> {land.area} acres
                  </Typography>
                  <Chip
                    label={land.status}
                    color={land.status === 'Verified' ? 'success' : land.status === 'Pending' ? 'warning' : 'error'}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleLandClick(land)}
                    sx={{ width: '100%' }}
                  >
                    View Details
                  </Button>
                </Box>
              </Popup>
            </Marker>
            
            {land.polygon && (
              <Polygon
                positions={land.polygon}
                pathOptions={{
                  color: land.isOwned ? '#2196f3' : '#4caf50',
                  weight: 2,
                  opacity: 0.7,
                  fillOpacity: 0.2,
                }}
                eventHandlers={{
                  click: () => handleLandClick(land),
                }}
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Mobile-optimized map controls */}
      {isMobile && (
        <>
          {/* Zoom controls */}
          <Box sx={{ position: 'absolute', right: 16, top: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <IconButton
              onClick={handleZoomIn}
              sx={{ 
                bgcolor: 'background.paper', 
                boxShadow: 2,
                '&:hover': { bgcolor: 'background.paper' }
              }}
            >
              <ZoomIn />
            </IconButton>
            <IconButton
              onClick={handleZoomOut}
              sx={{ 
                bgcolor: 'background.paper', 
                boxShadow: 2,
                '&:hover': { bgcolor: 'background.paper' }
              }}
            >
              <ZoomOut />
            </IconButton>
          </Box>

          {/* Location and fullscreen controls */}
          <Box sx={{ position: 'absolute', left: 16, bottom: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Fab
              size="medium"
              color="primary"
              onClick={handleLocateMe}
              sx={{ boxShadow: 2 }}
            >
              <MyLocation />
            </Fab>
            <Fab
              size="medium"
              color="secondary"
              onClick={handleFullscreen}
              sx={{ boxShadow: 2 }}
            >
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </Fab>
          </Box>
        </>
      )}

      {/* Land Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 8,
            maxHeight: isMobile ? '100vh' : '80vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">
            Land Details
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <Info />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {selectedLand && (
            <Box sx={{ pt: 1 }}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    {selectedLand.surveyNumber}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <Chip
                      icon={<VerifiedUser />}
                      label={selectedLand.status}
                      color={selectedLand.status === 'Verified' ? 'success' : 'warning'}
                    />
                    <Chip
                      icon={<LocationOn />}
                      label={`${selectedLand.area} acres`}
                      color="info"
                    />
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Owner:</strong> {selectedLand.ownerName || selectedLand.owner}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Location:</strong> {selectedLand.location}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Registration Date:</strong> {selectedLand.registrationDate}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Market Value:</strong> ₹{selectedLand.price.toLocaleString()}
                  </Typography>
                  
                  {selectedLand.lastTransactionHash && (
                    <Typography variant="body2" sx={{ mt: 2, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      <strong>Last Transaction:</strong> {selectedLand.lastTransactionHash}
                    </Typography>
                  )}
                </CardContent>
              </Card>
              
              {selectedLand.documents && selectedLand.documents.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Documents
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedLand.documents.map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc}
                          variant="outlined"
                          clickable
                          onClick={() => console.log('View document:', doc)}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
          {selectedLand && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                console.log('View on map:', selectedLand);
                handleCloseDialog();
              }}
            >
              View on Map
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InteractiveMap;
