import React, { useState, useEffect } from 'react';
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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,

  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress
} from '@mui/material';

import {
  SwapHoriz,
  History,
  Search,
  FilterList,
  Download,
  Visibility,
  Assignment,
  AccountBalance,
  MonetizationOn,
  TrendingUp,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Info,
  Person,
  Business,
  Home,
  Gavel,
  Receipt,
  Description,
  CalendarToday,
  Timeline as TimelineIcon,
  ExpandMore,
  Refresh,
  Print,
  Share,
  MoreVert,
  CreditCard,
  Money,
  Security,
  VerifiedUser,
  LocationOn,
  DateRange
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';

interface LandTransfer {
  id: string;
  surveyNumber: string;
  propertyId: string;
  fromOwner: string;
  fromOwnerName: string;
  toOwner: string;
  toOwnerName: string;
  transferType: 'sale' | 'gift' | 'inheritance' | 'partition' | 'mortgage' | 'lease' | 'court_order';
  status: 'pending' | 'approved' | 'completed' | 'rejected' | 'cancelled';
  amount?: number;
  transferDate: string;
  completionDate?: string;
  propertyDetails: {
    address: string;
    area: number;
    areaUnit: string;
    landType: string;
    estimatedValue: number;
  };
  documents: string[];
  fees: {
    registrationFee: number;
    stampDuty: number;
    processingFee: number;
    totalFees: number;
  };
  approvals: TransferApproval[];
  blockchainTx?: string;
  notes?: string;
}

interface TransferApproval {
  id: string;
  approverType: 'registrar' | 'government' | 'bank' | 'court';
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  approvalDate?: string;
  comments?: string;
  requiredDocuments: string[];
  submittedDocuments: string[];
}

interface MortgageRecord {
  id: string;
  propertyId: string;
  surveyNumber: string;
  borrower: string;
  borrowerName: string;
  lender: string;
  lenderName: string;
  mortgageType: 'simple' | 'conditional' | 'usufructuary' | 'english';
  principalAmount: number;
  interestRate: number;
  tenure: number; // months
  startDate: string;
  maturityDate: string;
  status: 'active' | 'closed' | 'defaulted' | 'foreclosed';
  emiAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  collateralValue: number;
  documents: string[];
  paymentHistory: PaymentRecord[];
}

interface PaymentRecord {
  id: string;
  paymentDate: string;
  amount: number;
  principal: number;
  interest: number;
  balance: number;
  status: 'paid' | 'pending' | 'overdue';
  transactionId?: string;
}

interface OwnershipHistory {
  id: string;
  propertyId: string;
  surveyNumber: string;
  owner: string;
  ownerName: string;
  acquisitionDate: string;
  acquisitionType: 'purchase' | 'inheritance' | 'gift' | 'partition' | 'court_order' | 'original';
  transferValue?: number;
  duration: string;
  endDate?: string;
  blockchainTx?: string;
  documents: string[];
  notes?: string;
}

const LandTransfersPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { account } = useWeb3();
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedTransfer, setSelectedTransfer] = useState<LandTransfer | null>(null);
  const [selectedMortgage, setSelectedMortgage] = useState<MortgageRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const mockTransfers: LandTransfer[] = [
    {
      id: 'TRF-001',
      surveyNumber: 'SUR-001-2024',
      propertyId: 'PROP-001',
      fromOwner: '0x1234...5678',
      fromOwnerName: 'Sample Owner 1',
      toOwner: account || '0x9876...4321',
      toOwnerName: user?.name || 'Current User',
      transferType: 'sale',
      status: 'completed',
      amount: 5000000,
      transferDate: '2024-08-15',
      completionDate: '2024-08-20',
      propertyDetails: {
        address: 'Sample Address 1, District A',
        area: 2400,
        areaUnit: 'sqft',
        landType: 'Residential',
        estimatedValue: 5200000
      },
      documents: ['sale_deed.pdf', 'noc.pdf', 'payment_receipt.pdf'],
      fees: {
        registrationFee: 50000,
        stampDuty: 312000,
        processingFee: 5000,
        totalFees: 367000
      },
      approvals: [
        {
          id: 'APP-001',
          approverType: 'registrar',
          approverName: 'Registrar Office',
          status: 'approved',
          approvalDate: '2024-08-18',
          comments: 'All documents verified and approved',
          requiredDocuments: ['sale_deed.pdf', 'noc.pdf'],
          submittedDocuments: ['sale_deed.pdf', 'noc.pdf']
        }
      ],
      blockchainTx: '0xabc123...def456',
      notes: 'Sale completed successfully'
    },
    {
      id: 'TRF-002',
      surveyNumber: 'SUR-002-2024',
      propertyId: 'PROP-002',
      fromOwner: account || '0x9876...4321',
      fromOwnerName: user?.name || 'Current User',
      toOwner: '0x5555...7777',
      toOwnerName: 'Sample Buyer',
      transferType: 'sale',
      status: 'pending',
      amount: 3500000,
      transferDate: '2024-08-22',
      propertyDetails: {
        address: 'Sample Address 2, District B',
        area: 1800,
        areaUnit: 'sqft',
        landType: 'Residential',
        estimatedValue: 3600000
      },
      documents: ['sale_deed.pdf', 'noc_pending.pdf'],
      fees: {
        registrationFee: 35000,
        stampDuty: 210000,
        processingFee: 3500,
        totalFees: 248500
      },
      approvals: [
        {
          id: 'APP-002',
          approverType: 'registrar',
          approverName: 'Registrar Office',
          status: 'pending',
          requiredDocuments: ['sale_deed.pdf', 'noc.pdf', 'payment_receipt.pdf'],
          submittedDocuments: ['sale_deed.pdf']
        }
      ],
      notes: 'Awaiting NOC from municipal authority'
    }
  ];

  const mockMortgages: MortgageRecord[] = [
    {
      id: 'MTG-001',
      propertyId: 'PROP-001',
      surveyNumber: 'SUR-001-2024',
      borrower: account || '0x9876...4321',
      borrowerName: user?.name || 'Current User',
      lender: '0xbank...1234',
      lenderName: 'Sample Bank Ltd.',
      mortgageType: 'simple',
      principalAmount: 3500000,
      interestRate: 8.5,
      tenure: 240, // 20 years
      startDate: '2024-09-01',
      maturityDate: '2044-08-31',
      status: 'active',
      emiAmount: 30240,
      paidAmount: 60480,
      outstandingAmount: 3439520,
      collateralValue: 5200000,
      documents: ['mortgage_deed.pdf', 'valuation_report.pdf', 'income_proof.pdf'],
      paymentHistory: [
        {
          id: 'PAY-001',
          paymentDate: '2024-09-01',
          amount: 30240,
          principal: 5573,
          interest: 24667,
          balance: 3494427,
          status: 'paid',
          transactionId: 'TXN-001'
        },
        {
          id: 'PAY-002',
          paymentDate: '2024-10-01',
          amount: 30240,
          principal: 5612,
          interest: 24628,
          balance: 3488815,
          status: 'paid',
          transactionId: 'TXN-002'
        }
      ]
    }
  ];

  const mockOwnershipHistory: OwnershipHistory[] = [
    {
      id: 'OH-001',
      propertyId: 'PROP-001',
      surveyNumber: 'SUR-001-2024',
      owner: '0xoriginal...1234',
      ownerName: 'Original Owner',
      acquisitionDate: '2020-05-15',
      acquisitionType: 'original',
      duration: '4 years 3 months',
      endDate: '2024-08-15',
      blockchainTx: '0x111...222',
      documents: ['original_registration.pdf'],
      notes: 'Original registration when property was first recorded'
    },
    {
      id: 'OH-002',
      propertyId: 'PROP-001',
      surveyNumber: 'SUR-001-2024',
      owner: account || '0x9876...4321',
      ownerName: user?.name || 'Current User',
      acquisitionDate: '2024-08-15',
      acquisitionType: 'purchase',
      transferValue: 5000000,
      duration: 'Current Owner',
      blockchainTx: '0xabc123...def456',
      documents: ['purchase_deed.pdf', 'payment_proof.pdf'],
      notes: 'Purchased from original owner'
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'approved':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Schedule color="warning" />;
      case 'rejected':
        return <Error color="error" />;
      case 'cancelled':
        return <Warning color="error" />;
      case 'active':
        return <TrendingUp color="success" />;
      case 'closed':
        return <CheckCircle color="info" />;
      case 'defaulted':
        return <Warning color="error" />;
      case 'foreclosed':
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
      case 'cancelled':
      case 'defaulted':
      case 'foreclosed':
        return 'error';
      case 'closed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTransferTypeIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <MonetizationOn color="primary" />;
      case 'gift':
        return <Receipt color="secondary" />;
      case 'inheritance':
        return <Assignment color="info" />;
      case 'mortgage':
        return <AccountBalance color="warning" />;
      case 'lease':
        return <Home color="success" />;
      case 'court_order':
        return <Gavel color="error" />;
      default:
        return <SwapHoriz color="action" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTransfers = mockTransfers.filter(transfer => {
    const matchesSearch = 
      transfer.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.fromOwnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.toOwnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.propertyDetails.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transfer.status === filterStatus;
    const matchesType = filterType === 'all' || transfer.transferType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const TransfersTab = () => (
    <Box>
      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search transfers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="gift">Gift</MenuItem>
                <MenuItem value="inheritance">Inheritance</MenuItem>
                <MenuItem value="mortgage">Mortgage</MenuItem>
                <MenuItem value="lease">Lease</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Download />}
              onClick={() => {/* Download functionality */}}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Transfers List */}
      <Grid container spacing={3}>
        {filteredTransfers.map((transfer) => (
          <Grid item xs={12} key={transfer.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getTransferTypeIcon(transfer.transferType)}
                      <Typography variant="h6" sx={{ ml: 1, mr: 2 }}>
                        {transfer.surveyNumber}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(transfer.status)}
                        label={transfer.status.toUpperCase()}
                        color={getStatusColor(transfer.status) as any}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {transfer.propertyDetails.address}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Typography variant="body2">
                        <strong>From:</strong> {transfer.fromOwnerName}
                      </Typography>
                      <SwapHoriz color="action" />
                      <Typography variant="body2">
                        <strong>To:</strong> {transfer.toOwnerName}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Type:</strong> {transfer.transferType.replace('_', ' ').toUpperCase()}
                      {transfer.amount && (
                        <span style={{ marginLeft: 16 }}>
                          <strong>Amount:</strong> {formatCurrency(transfer.amount)}
                        </span>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        Transfer Date: {formatDate(transfer.transferDate)}
                      </Typography>
                      {transfer.completionDate && (
                        <Typography variant="body2" color="text.secondary">
                          Completed: {formatDate(transfer.completionDate)}
                        </Typography>
                      )}
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => {
                            setSelectedTransfer(transfer);
                            setDialogOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const MortgagesTab = () => (
    <Box>
      <Grid container spacing={3}>
        {mockMortgages.map((mortgage) => (
          <Grid item xs={12} key={mortgage.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccountBalance color="primary" />
                      <Typography variant="h6" sx={{ ml: 1, mr: 2 }}>
                        {mortgage.surveyNumber}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(mortgage.status)}
                        label={mortgage.status.toUpperCase()}
                        color={getStatusColor(mortgage.status) as any}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Lender: {mortgage.lenderName}
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Principal:</strong> {formatCurrency(mortgage.principalAmount)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Interest Rate:</strong> {mortgage.interestRate}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>EMI:</strong> {formatCurrency(mortgage.emiAmount)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Outstanding:</strong> {formatCurrency(mortgage.outstandingAmount)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        Start: {formatDate(mortgage.startDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Maturity: {formatDate(mortgage.maturityDate)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(mortgage.paidAmount / mortgage.principalAmount) * 100}
                        sx={{ my: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {((mortgage.paidAmount / mortgage.principalAmount) * 100).toFixed(1)}% paid
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => {
                            setSelectedMortgage(mortgage);
                            setDialogOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const HistoryTab = () => (
    <Box>
      <Grid container spacing={3}>
        {mockOwnershipHistory.map((history, index) => (
          <Grid item xs={12} key={history.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <Box sx={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: '50%', 
                        backgroundColor: 'primary.main', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 1
                      }}>
                        {history.acquisitionType === 'original' ? <Home sx={{ color: 'white' }} /> : 
                         history.acquisitionType === 'purchase' ? <MonetizationOn sx={{ color: 'white' }} /> :
                         history.acquisitionType === 'inheritance' ? <Assignment sx={{ color: 'white' }} /> :
                         <SwapHoriz sx={{ color: 'white' }} />}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(history.acquisitionDate)}
                      </Typography>
                      {history.endDate && (
                        <Typography variant="body2" color="text.secondary">
                          to {formatDate(history.endDate)}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        {history.duration}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={10}>
                    <Typography variant="h6" gutterBottom>
                      {history.ownerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {history.acquisitionType.replace('_', ' ').toUpperCase()}
                      {history.transferValue && ` - ${formatCurrency(history.transferValue)}`}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Survey Number:</strong> {history.surveyNumber}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Property ID:</strong> {history.propertyId}
                    </Typography>
                    {history.blockchainTx && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Blockchain TX:</strong> {history.blockchainTx}
                      </Typography>
                    )}
                    {history.notes && (
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                        {history.notes}
                      </Typography>
                    )}
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={history.acquisitionType.replace('_', ' ').toUpperCase()}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {history.documents.map((doc, docIndex) => (
                        <Chip
                          key={docIndex}
                          label={doc}
                          size="small"
                          icon={<Description />}
                          sx={{ ml: 1 }}
                          onClick={() => {/* Open document */}}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Land Transfers & Records
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Complete history of land ownership, transfers, mortgages, and loans
      </Typography>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab
            icon={<SwapHoriz />}
            label="Transfers"
            iconPosition="start"
          />
          <Tab
            icon={<AccountBalance />}
            label="Mortgages & Loans"
            iconPosition="start"
          />
          <Tab
            icon={<TimelineIcon />}
            label="Ownership History"
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {currentTab === 0 && <TransfersTab />}
      {currentTab === 1 && <MortgagesTab />}
      {currentTab === 2 && <HistoryTab />}

      {/* Transfer Details Dialog */}
      <Dialog
        open={dialogOpen && !!selectedTransfer}
        onClose={() => {
          setDialogOpen(false);
          setSelectedTransfer(null);
        }}
        maxWidth="md"
        fullWidth
      >
        {selectedTransfer && (
          <>
            <DialogTitle>
              Transfer Details - {selectedTransfer.surveyNumber}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Chip
                    icon={getStatusIcon(selectedTransfer.status)}
                    label={selectedTransfer.status.toUpperCase()}
                    color={getStatusColor(selectedTransfer.status) as any}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">From Owner</Typography>
                  <Typography variant="body2">{selectedTransfer.fromOwnerName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedTransfer.fromOwner}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">To Owner</Typography>
                  <Typography variant="body2">{selectedTransfer.toOwnerName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedTransfer.toOwner}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Property Details</Typography>
                  <Typography variant="body2">{selectedTransfer.propertyDetails.address}</Typography>
                  <Typography variant="body2">
                    Area: {selectedTransfer.propertyDetails.area} {selectedTransfer.propertyDetails.areaUnit}
                  </Typography>
                  <Typography variant="body2">
                    Type: {selectedTransfer.propertyDetails.landType}
                  </Typography>
                  <Typography variant="body2">
                    Estimated Value: {formatCurrency(selectedTransfer.propertyDetails.estimatedValue)}
                  </Typography>
                </Grid>
                {selectedTransfer.amount && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Transfer Amount</Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(selectedTransfer.amount)}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Fees Breakdown</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Registration Fee</TableCell>
                          <TableCell align="right">{formatCurrency(selectedTransfer.fees.registrationFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Stamp Duty</TableCell>
                          <TableCell align="right">{formatCurrency(selectedTransfer.fees.stampDuty)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Processing Fee</TableCell>
                          <TableCell align="right">{formatCurrency(selectedTransfer.fees.processingFee)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                          <TableCell><strong>Total Fees</strong></TableCell>
                          <TableCell align="right"><strong>{formatCurrency(selectedTransfer.fees.totalFees)}</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setDialogOpen(false);
                setSelectedTransfer(null);
              }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Mortgage Details Dialog */}
      <Dialog
        open={dialogOpen && !!selectedMortgage}
        onClose={() => {
          setDialogOpen(false);
          setSelectedMortgage(null);
        }}
        maxWidth="md"
        fullWidth
      >
        {selectedMortgage && (
          <>
            <DialogTitle>
              Mortgage Details - {selectedMortgage.surveyNumber}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Chip
                    icon={getStatusIcon(selectedMortgage.status)}
                    label={selectedMortgage.status.toUpperCase()}
                    color={getStatusColor(selectedMortgage.status) as any}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Borrower</Typography>
                  <Typography variant="body2">{selectedMortgage.borrowerName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Lender</Typography>
                  <Typography variant="body2">{selectedMortgage.lenderName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Principal Amount</Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(selectedMortgage.principalAmount)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Outstanding Amount</Typography>
                  <Typography variant="h6" color="warning.main">
                    {formatCurrency(selectedMortgage.outstandingAmount)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Interest Rate</Typography>
                  <Typography variant="body2">{selectedMortgage.interestRate}% p.a.</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">EMI Amount</Typography>
                  <Typography variant="body2">{formatCurrency(selectedMortgage.emiAmount)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Tenure</Typography>
                  <Typography variant="body2">{selectedMortgage.tenure} months</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Payment Progress</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(selectedMortgage.paidAmount / selectedMortgage.principalAmount) * 100}
                    sx={{ my: 1, height: 8 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(selectedMortgage.paidAmount)} paid of {formatCurrency(selectedMortgage.principalAmount)}
                    ({((selectedMortgage.paidAmount / selectedMortgage.principalAmount) * 100).toFixed(1)}%)
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Recent Payments</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Principal</TableCell>
                          <TableCell align="right">Interest</TableCell>
                          <TableCell align="right">Balance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedMortgage.paymentHistory.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                            <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                            <TableCell align="right">{formatCurrency(payment.principal)}</TableCell>
                            <TableCell align="right">{formatCurrency(payment.interest)}</TableCell>
                            <TableCell align="right">{formatCurrency(payment.balance)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setDialogOpen(false);
                setSelectedMortgage(null);
              }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default LandTransfersPage;
