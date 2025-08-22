import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Badge
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  ArrowBack,
  Receipt,
  Link,
  Download,
  Share,
  Verified,
  Schedule,
  Person,
  LocationOn,
  Description,
  Security,
  AccountBalance,
  MonetizationOn,
  Gavel,
  CheckCircle,
  Warning,
  Error,
  Info,
  ExpandMore,
  ContentCopy,
  Visibility,
  Print,
  QrCode,
  OpenInNew
} from '@mui/icons-material';

interface TransactionDetail {
  id: string;
  hash: string;
  type: 'registration' | 'transfer' | 'verification' | 'dispute';
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  
  // Basic Information
  title: string;
  description: string;
  amount: number;
  currency: string;
  
  // Blockchain Data
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  gasUsed: number;
  gasPrice: number;
  confirmations: number;
  
  // Timing
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  
  // Parties Involved
  fromAddress: string;
  toAddress: string;
  fromName?: string;
  toName?: string;
  
  // Property Information
  propertyId?: string;
  surveyNumber?: string;
  propertyAddress?: string;
  propertyArea?: number;
  propertyType?: string;
  
  // Documents
  documents: TransactionDocument[];
  
  // Fees and Costs
  fees: TransactionFee[];
  
  // Timeline Events
  events: TransactionEvent[];
  
  // Verification
  verifiedBy?: string;
  verificationDate?: string;
  verificationNotes?: string;
}

interface TransactionDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  hash: string;
  ipfsHash?: string;
  uploadDate: string;
  verifiedBy?: string;
}

interface TransactionFee {
  type: 'registration' | 'stamp_duty' | 'processing' | 'gas' | 'legal';
  amount: number;
  currency: string;
  description: string;
  paidBy: string;
}

interface TransactionEvent {
  id: string;
  type: 'created' | 'submitted' | 'verified' | 'approved' | 'completed' | 'failed';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  actorName?: string;
}

const TransactionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareDialog, setShareDialog] = useState(false);
  const [qrDialog, setQrDialog] = useState(false);

  // Mock transaction data
  useEffect(() => {
    const mockTransaction: TransactionDetail = {
      id: 'TXN-001-2024',
      hash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz567',
      type: 'registration',
      status: 'completed',
      
      title: 'Land Registration - Residential Plot',
      description: 'Registration of residential land plot in Sector 15, Noida',
      amount: 5200000,
      currency: 'INR',
      
      blockNumber: 18567234,
      blockHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      transactionIndex: 42,
      gasUsed: 234567,
      gasPrice: 20000000000,
      confirmations: 156,
      
      timestamp: '2024-08-20T14:30:25Z',
      createdAt: '2024-08-20T10:15:00Z',
      updatedAt: '2024-08-20T14:30:25Z',
      completedAt: '2024-08-20T14:30:25Z',
      
      fromAddress: '0x0000000000000000000000000000000000000000',
      toAddress: '0x1234567890abcdef1234567890abcdef12345678',
      fromName: 'Land Registry Authority',
              toName: 'Sample Owner',
      
      propertyId: 'PROP-001-2024',
      surveyNumber: 'SUR-001-2024',
      propertyAddress: 'Plot No. 123, Sector 15, Noida, Uttar Pradesh',
      propertyArea: 2400,
      propertyType: 'Residential',
      
      documents: [
        {
          id: 'DOC-001',
          name: 'Sale Deed',
          type: 'PDF',
          size: 2456789,
          hash: '0xdef456abc123ghi789...',
          ipfsHash: 'QmXyZ123abc456def789',
          uploadDate: '2024-08-20T10:20:00Z',
          verifiedBy: 'Registrar Office'
        },
        {
          id: 'DOC-002',
          name: 'Property Card',
          type: 'PDF',
          size: 1234567,
          hash: '0x789ghi456def123abc...',
          ipfsHash: 'QmAbc789xyz123def456',
          uploadDate: '2024-08-20T10:25:00Z',
          verifiedBy: 'Survey Department'
        },
        {
          id: 'DOC-003',
          name: 'NOC Certificate',
          type: 'PDF',
          size: 987654,
          hash: '0x123abc789def456ghi...',
          uploadDate: '2024-08-20T10:30:00Z'
        }
      ],
      
      fees: [
        {
          type: 'registration',
          amount: 50000,
          currency: 'INR',
          description: 'Registration Fee',
          paidBy: 'Sample Owner'
        },
        {
          type: 'stamp_duty',
          amount: 312000,
          currency: 'INR',
          description: 'Stamp Duty (6%)',
          paidBy: 'Sample Owner'
        },
        {
          type: 'processing',
          amount: 5000,
          currency: 'INR',
          description: 'Processing Fee',
          paidBy: 'Sample Owner'
        },
        {
          type: 'gas',
          amount: 0.0047,
          currency: 'ETH',
          description: 'Blockchain Gas Fee',
          paidBy: 'System'
        }
      ],
      
      events: [
        {
          id: 'EVT-001',
          type: 'created',
          title: 'Registration Request Created',
          description: 'Land registration request submitted by applicant',
          timestamp: '2024-08-20T10:15:00Z',
          actor: '0x1234567890abcdef1234567890abcdef12345678',
          actorName: 'Sample Owner'
        },
        {
          id: 'EVT-002',
          type: 'submitted',
          title: 'Documents Submitted',
          description: 'All required documents uploaded and verified',
          timestamp: '2024-08-20T11:30:00Z',
          actor: '0x1234567890abcdef1234567890abcdef12345678',
          actorName: 'Sample Owner'
        },
        {
          id: 'EVT-003',
          type: 'verified',
          title: 'Document Verification',
          description: 'Documents verified by registrar office',
          timestamp: '2024-08-20T13:15:00Z',
          actor: '0xabcdef1234567890abcdef1234567890abcdef12',
          actorName: 'Registrar Office'
        },
        {
          id: 'EVT-004',
          type: 'approved',
          title: 'Registration Approved',
          description: 'Land registration approved by authorities',
          timestamp: '2024-08-20T14:00:00Z',
          actor: '0xabcdef1234567890abcdef1234567890abcdef12',
          actorName: 'Land Registry Authority'
        },
        {
          id: 'EVT-005',
          type: 'completed',
          title: 'Blockchain Recording',
          description: 'Registration recorded on blockchain successfully',
          timestamp: '2024-08-20T14:30:25Z',
          actor: '0x0000000000000000000000000000000000000000',
          actorName: 'Blockchain Network'
        }
      ],
      
      verifiedBy: 'Land Registry Authority',
      verificationDate: '2024-08-20T14:00:00Z',
      verificationNotes: 'All documents verified and registration completed successfully'
    };

    setTimeout(() => {
      setTransaction(mockTransaction);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Schedule color="warning" />;
      case 'failed':
        return <Error color="error" />;
      case 'cancelled':
        return <Warning color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'error';
      default:
        return 'info';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <Receipt color="primary" />;
      case 'submitted':
        return <Description color="info" />;
      case 'verified':
        return <Verified color="success" />;
      case 'approved':
        return <Gavel color="warning" />;
      case 'completed':
        return <CheckCircle color="success" />;
      case 'failed':
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount);
    } else if (currency === 'ETH') {
      return `${amount.toFixed(6)} ${currency}`;
    }
    return `${amount} ${currency}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const handleShare = () => {
    const shareData = {
      title: `Transaction ${transaction?.id}`,
      text: transaction?.description,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      setShareDialog(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h6">Loading transaction details...</Typography>
      </Container>
    );
  }

  if (!transaction) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Transaction not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600, flexGrow: 1 }}>
            Transaction Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={handleShare}
            >
              Share
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => {}}
            >
              Download Receipt
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ color: 'primary.main' }}>
            {transaction.id}
          </Typography>
          <Chip
            icon={getStatusIcon(transaction.status)}
            label={transaction.status.toUpperCase()}
            color={getStatusColor(transaction.status) as any}
          />
          {transaction.verifiedBy && (
            <Chip
              icon={<Verified />}
              label="VERIFIED"
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Transaction Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction Overview
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Title:</strong> {transaction.title}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Description:</strong> {transaction.description}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Type:</strong> {transaction.type.replace('_', ' ').toUpperCase()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Amount:</strong> {formatCurrency(transaction.amount, transaction.currency)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Created:</strong> {new Date(transaction.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Completed:</strong> {transaction.completedAt ? new Date(transaction.completedAt).toLocaleString() : 'Pending'}
                  </Typography>
                  {transaction.verifiedBy && (
                    <Typography variant="body1" gutterBottom>
                      <strong>Verified By:</strong> {transaction.verifiedBy}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Blockchain Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Security sx={{ mr: 1 }} color="primary" />
                Blockchain Data
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Transaction Hash
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', wordBreak: 'break-all', flexGrow: 1 }}
                  >
                    {transaction.hash}
                  </Typography>
                  <IconButton size="small" onClick={() => copyToClipboard(transaction.hash)}>
                    <ContentCopy fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')}>
                    <OpenInNew fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Block Number
                  </Typography>
                  <Typography variant="body1">
                    {transaction.blockNumber.toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Confirmations
                  </Typography>
                  <Typography variant="body1">
                    {transaction.confirmations}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Gas Used
                  </Typography>
                  <Typography variant="body1">
                    {transaction.gasUsed.toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Gas Price
                  </Typography>
                  <Typography variant="body1">
                    {(transaction.gasPrice / 1e9).toFixed(2)} Gwei
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Property Information */}
        {transaction.propertyId && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1 }} color="primary" />
                  Property Details
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Property ID:</strong> {transaction.propertyId}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Survey Number:</strong> {transaction.surveyNumber}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Address:</strong> {transaction.propertyAddress}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Area:</strong> {transaction.propertyArea?.toLocaleString()} sq ft
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Type:</strong> {transaction.propertyType}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Parties Involved */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} color="primary" />
                Parties Involved
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(0, 212, 255, 0.1)', borderRadius: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      From
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>{transaction.fromName || 'Unknown'}</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                    >
                      {transaction.fromAddress}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(0, 184, 148, 0.1)', borderRadius: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      To
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>{transaction.toName || 'Unknown'}</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                    >
                      {transaction.toAddress}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Fees and Costs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <MonetizationOn sx={{ mr: 1 }} color="primary" />
                Fees & Costs
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Paid By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transaction.fees.map((fee, index) => (
                      <TableRow key={index}>
                        <TableCell>{fee.description}</TableCell>
                        <TableCell>{formatCurrency(fee.amount, fee.currency)}</TableCell>
                        <TableCell>{fee.paidBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Documents */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Description sx={{ mr: 1 }} color="primary" />
                Documents ({transaction.documents.length})
              </Typography>
              
              <List dense>
                {transaction.documents.map((doc) => (
                  <ListItem key={doc.id}>
                    <ListItemIcon>
                      <Description color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={doc.name}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {doc.type} • {formatFileSize(doc.size)}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </Typography>
                          {doc.verifiedBy && (
                            <Chip
                              label={`Verified by ${doc.verifiedBy}`}
                              size="small"
                              color="success"
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      }
                    />
                    <IconButton size="small">
                      <Download />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Transaction Timeline */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 1 }} color="primary" />
                Transaction Timeline
              </Typography>
              
              <Timeline>
                {transaction.events.map((event, index) => (
                  <TimelineItem key={event.id}>
                    <TimelineOppositeContent sx={{ m: 'auto 0' }} align="right" variant="body2" color="text.secondary">
                      {new Date(event.timestamp).toLocaleString()}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot>
                        {getEventIcon(event.type)}
                      </TimelineDot>
                      {index < transaction.events.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Typography variant="h6" component="span">
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        by {event.actorName || event.actor}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Share Dialog */}
      <Dialog open={shareDialog} onClose={() => setShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Transaction</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ flexGrow: 1, fontFamily: 'monospace' }}>
              {window.location.href}
            </Typography>
            <IconButton onClick={() => copyToClipboard(window.location.href)}>
              <ContentCopy />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TransactionDetailsPage;
