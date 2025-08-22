import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Divider,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  Person,
  Landscape,
  Verified,
  Clear,
  Tune,
} from '@mui/icons-material';
import {
  PageTransition,
  AnimatedGradientText,
  LandCardSkeleton,
  GlowingBox,
} from '../components/AnimatedComponents';

interface LandRecord {
  id: string;
  surveyNumber: string;
  owner: string;
  location: string;
  area: string;
  status: 'Verified' | 'Pending' | 'Disputed';
  price?: string;
  coordinates?: [number, number];
  registrationDate: string;
}

// Mock data for demonstration
const mockLandRecords: LandRecord[] = [
  {
    id: '1',
    surveyNumber: 'SUR-001-2024',
    owner: '0x1234...5678',
    location: 'Downtown District, Block A',
    area: '2.5 acres',
    status: 'Verified',
    price: '₹50,00,000',
    coordinates: [77.2090, 28.6139],
    registrationDate: '2024-01-15',
  },
  {
    id: '2',
    surveyNumber: 'SUR-002-2024',
    owner: '0x9876...4321',
    location: 'Green Valley, Sector 12',
    area: '1.8 acres',
    status: 'Verified',
    price: '₹35,00,000',
    coordinates: [77.2190, 28.6239],
    registrationDate: '2024-02-20',
  },
  {
    id: '3',
    surveyNumber: 'SUR-003-2024',
    owner: '0x5555...7777',
    location: 'Industrial Zone, Plot 45',
    area: '5.0 acres',
    status: 'Pending',
    price: '₹1,20,00,000',
    coordinates: [77.2290, 28.6339],
    registrationDate: '2024-03-10',
  },
];

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [results, setResults] = useState<LandRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Simulate search with loading
  useEffect(() => {
    if (searchTerm.length > 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        const filtered = mockLandRecords.filter(record => {
          const matchesSearch = 
            record.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.location.toLowerCase().includes(searchTerm.toLowerCase());
          
          const matchesStatus = statusFilter === 'all' || record.status.toLowerCase() === statusFilter;
          
          return matchesSearch && matchesStatus;
        });
        setResults(filtered);
        setLoading(false);
      }, 1000); // Simulate API delay
      
      return () => clearTimeout(timer);
    } else {
      setResults(mockLandRecords);
    }
  }, [searchTerm, statusFilter]);

  // Initialize with all records
  useEffect(() => {
    setResults(mockLandRecords);
  }, []);

  const handleSearch = () => {
    // Search is handled by useEffect
  };

  const clearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setResults(mockLandRecords);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'success';
      case 'Pending': return 'warning';
      case 'Disputed': return 'error';
      default: return 'default';
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AnimatedGradientText variant="h3" gutterBottom>
              🔍 Search Land Records
            </AnimatedGradientText>
            <Typography variant="h6" color="text.secondary">
              Find land properties by survey number, owner address, or location
            </Typography>
          </Box>

          {/* Search Bar */}
          <GlowingBox sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: showFilters ? 2 : 0 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter survey number, owner address, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={clearSearch} size="small">
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<Search />}
                sx={{ minWidth: 120, height: 56 }}
              >
                Search
              </Button>
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'primary.main',
                  bgcolor: showFilters ? 'primary.main' : 'transparent',
                  color: showFilters ? 'primary.contrastText' : 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }
                }}
              >
                <Tune />
              </IconButton>
            </Box>

            {/* Advanced Filters */}
            {showFilters && (
              <Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Status Filter</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status Filter"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="verified">Verified</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="disputed">Disputed</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    onClick={clearSearch}
                    startIcon={<Clear />}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </Box>
            )}
          </GlowingBox>

          {/* Loading Bar */}
          {loading && (
            <Box sx={{ mb: 4 }}>
              <LinearProgress 
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'rgba(0, 212, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #00D4FF 0%, #6C5CE7 100%)',
                  }
                }}
              />
            </Box>
          )}

          {/* Results */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
              Search Results ({results.length})
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                    <LandCardSkeleton />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {results.map((record) => (
                  <Box key={record.id} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                    <Card sx={{ height: '100%', cursor: 'pointer' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                              {record.surveyNumber}
                            </Typography>
                            <Chip 
                              label={record.status} 
                              color={getStatusColor(record.status) as any}
                              size="small"
                              icon={record.status === 'Verified' ? <Verified /> : undefined}
                            />
                          </Box>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Landscape />
                          </Avatar>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Person sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Owner: {record.owner}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {record.location}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Landscape sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Area: {record.area}
                            </Typography>
                          </Box>
                        </Box>
                        
                        {record.price && (
                          <Box sx={{ p: 2, bgcolor: 'rgba(0, 212, 255, 0.1)', borderRadius: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ color: 'primary.main' }}>
                              {record.price}
                            </Typography>
                          </Box>
                        )}
                        
                        <Typography variant="caption" color="text.secondary">
                          Registered: {record.registrationDate}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            )}
            
            {!loading && results.length === 0 && searchTerm && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  No Results Found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search terms or filters
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </PageTransition>
  );
};

export default SearchPage;
