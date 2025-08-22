import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Paper, Typography, Card, CardContent, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { LocationOn, Info, VerifiedUser } from '@mui/icons-material';

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
  const [selectedLand, setSelectedLand] = useState<LandProperty | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lands, setLands] = useState<LandProperty[]>([]);

  // Default map center (Delhi coordinates)
  const defaultCenter: [number, number] = [28.6139, 77.2090];
  const defaultZoom = 12;

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
      owner: userAddress || '0x5555...7777',
      ownerName: 'Bob Johnson',
      location: 'Industrial Zone, Plot 45',
      area: 5.0,
      coordinates: [77.2290, 28.6339],
      polygon: [
        [77.2280, 28.6330],
        [77.2300, 28.6330],
        [77.2300, 28.6348],
        [77.2280, 28.6348],
        [77.2280, 28.6330]
      ],
      status: 'Pending',
      price: 12000000,
      registrationDate: '2024-03-10',
      isOwned: userAddress === '0x5555...7777'
    }
  ];

  useEffect(() => {
    // Filter lands based on showUserLandsOnly prop
    const filteredLands = showUserLandsOnly 
      ? mockLands.filter(land => land.isOwned)
      : mockLands;
    
    setLands(filteredLands);
  }, [showUserLandsOnly, userAddress, mockLands]);

  // Create custom icon for different land statuses
  const createCustomIcon = (status: string, isOwned: boolean) => {
    const iconHtml = `
      <div style="
        background-color: ${isOwned ? '#00B894' : '#6C5CE7'};
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #00D4FF;
        box-shadow: 0 2px 10px rgba(0, 212, 255, 0.5);
        cursor: pointer;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        ${status === 'Verified' ? '✓' : status === 'Pending' ? '⏳' : '⚠'}
      </div>
    `;
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  const handleLandClick = (land: LandProperty) => {
    setSelectedLand(land);
    setDialogOpen(true);
    if (onLandSelect) {
      onLandSelect(land);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Land Parcels */}
        {lands.map((land) => (
          <React.Fragment key={land.id}>
            {/* Land Boundary Polygon */}
            {land.polygon && (
              <Polygon
                positions={land.polygon.map(coord => [coord[1], coord[0]])} // Leaflet uses [lat, lng] format
                pathOptions={{
                  fillColor: land.isOwned ? '#00B894' : '#6C5CE7',
                  fillOpacity: land.isOwned ? 0.4 : 0.2,
                  color: '#00D4FF',
                  weight: 2,
                  opacity: 0.8,
                }}
              />
            )}
            
            {/* Land Marker */}
            <Marker
              position={[land.coordinates[1], land.coordinates[0]]} // Leaflet uses [lat, lng] format
              icon={createCustomIcon(land.status, land.isOwned || false)}
              eventHandlers={{
                click: () => handleLandClick(land),
              }}
            >
              <Popup>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="h6" gutterBottom>
                    {land.surveyNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Owner: {land.ownerName || land.owner}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Area: {land.area} acres
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Price: {formatPrice(land.price)}
                  </Typography>
                  <Chip
                    label={land.status}
                    size="small"
                    color={land.status === 'Verified' ? 'success' : 'warning'}
                    sx={{ mt: 1 }}
                  />
                  {land.isOwned && (
                    <Chip
                      label="Your Property"
                      size="small"
                      color="success"
                      sx={{ mt: 1, ml: 1 }}
                    />
                  )}
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
      
      {/* Map Legend */}
      <Paper 
        sx={{ 
          position: 'absolute',
          top: 16,
          left: 16,
          p: 2,
          minWidth: 200,
          background: 'rgba(26, 26, 46, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
          Map Legend
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box 
            sx={{ 
              width: 16, 
              height: 16, 
              backgroundColor: '#00B894', 
              mr: 1, 
              borderRadius: 1,
              opacity: 0.7
            }} 
          />
          <Typography variant="caption">Your Lands</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box 
            sx={{ 
              width: 16, 
              height: 16, 
              backgroundColor: '#6C5CE7', 
              mr: 1, 
              borderRadius: 1,
              opacity: 0.4
            }} 
          />
          <Typography variant="caption">Other Properties</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 16, 
              height: 16, 
              border: '2px solid #00D4FF', 
              mr: 1, 
              borderRadius: 1
            }} 
          />
          <Typography variant="caption">Boundaries</Typography>
        </Box>
      </Paper>

      {/* Land Properties List */}
      <Paper 
        sx={{ 
          position: 'absolute',
          bottom: 16,
          right: 16,
          p: 2,
          maxWidth: 300,
          maxHeight: 200,
          overflow: 'auto',
          background: 'rgba(26, 26, 46, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
          Properties ({lands.length})
        </Typography>
        {lands.map((land) => (
          <Box
            key={land.id}
            onClick={() => handleLandClick(land)}
            sx={{
              p: 1,
              mb: 1,
              border: '1px solid',
              borderColor: selectedLand?.id === land.id ? 'primary.main' : 'divider',
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'rgba(0, 212, 255, 0.1)'
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn 
                sx={{ 
                  fontSize: 16, 
                  color: land.isOwned ? 'success.main' : 'secondary.main' 
                }} 
              />
              <Typography variant="caption" fontWeight="bold">
                {land.surveyNumber}
              </Typography>
              {land.isOwned && (
                <Chip label="Owned" size="small" color="success" />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {land.location}
            </Typography>
          </Box>
        ))}
      </Paper>

      {/* Land Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Info color="primary" />
            <Typography variant="h6">Land Details</Typography>
            {selectedLand?.isOwned && (
              <Chip label="Your Property" color="success" size="small" />
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'background.paper' }}>
          {selectedLand && (
            <Box sx={{ pt: 2 }}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justify: 'space-between', mb: 2 }}>
                    <Typography variant="h6" color="primary">
                      {selectedLand.surveyNumber}
                    </Typography>
                    <Chip
                      label={selectedLand.status}
                      color={selectedLand.status === 'Verified' ? 'success' : 'warning'}
                      icon={selectedLand.status === 'Verified' ? <VerifiedUser /> : undefined}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Owner:</strong> {selectedLand.ownerName || selectedLand.owner}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Location:</strong> {selectedLand.location}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Area:</strong> {selectedLand.area} acres
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Registration Date:</strong> {selectedLand.registrationDate}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: 'rgba(0, 212, 255, 0.1)', borderRadius: 2, mb: 2 }}>
                    <Typography variant="h5" sx={{ color: 'primary.main' }}>
                      {formatPrice(selectedLand.price)}
                    </Typography>
                  </Box>

                  {selectedLand.documents && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Documents:
                      </Typography>
                      {selectedLand.documents.map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc}
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'background.paper' }}>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          {selectedLand?.isOwned && (
            <Button variant="contained" sx={{ mr: 1 }}>
              Manage Property
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InteractiveMap;
