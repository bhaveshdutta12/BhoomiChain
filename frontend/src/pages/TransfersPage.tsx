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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot
} from '@mui/lab';
import {
  SwapHoriz,
  Add,
  Check,
  Close,
  MoreVert,
  Visibility,
  Schedule,
  VerifiedUser,
  Gavel,
  AccountBalance,
  Person,
  Description,
  LocationOn,
  History,
  TrendingUp,
  Security,
  Assignment,
  CheckCircle,
  Cancel,
  Pending,
  ExpandMore,
  Link,
  Receipt,
  FamilyRestroom,
  ShoppingCart,
  CardGiftcard,
  Business,
  AccessTime,
  MonetizationOn
} from '@mui/icons-material';

interface TransferRequest {
  id: string;
  surveyNumber: string;
  fromOwner: string;
  fromOwnerName: string;
  toOwner: string;
  toOwnerName: string;
  propertyId: string;
  propertyAddress: string;
  transferType: 'sale' | 'gift' | 'inheritance' | 'court_order';
  amount?: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  requestDate: string;
  approvalDate?: string;
  completionDate?: string;
  documents: string[];
  reason?: string;
  approver?: string;
  blockchainTx?: string;
  currentStep: number;
  estimatedValue?: number;
  propertyArea?: number;
  propertyType?: string;
  registrationFee?: number;
  stampDuty?: number;
}

interface OwnershipHistory {
  id: string;
  propertyId: string;
  surveyNumber: string;
  ownerName: string;
  ownerAddress: string;
  acquisitionDate: string;
  acquisitionType: 'purchase' | 'inheritance' | 'gift' | 'original';
  transferValue?: number;
  duration: string;
  blockchainTx?: string;
  documents: string[];
}

interface PropertyStats {
  totalTransfers: number;
  completedTransfers: number;
  pendingTransfers: number;
  totalValue: number;
  averageTransferTime: number;
  successRate: number;
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
      id={`transfer-tabpanel-${index}`}
      aria-labelledby={`transfer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const TransfersPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [newTransferDialog, setNewTransferDialog] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRequest | null>(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  
  const [newTransferData, setNewTransferData] = useState({
    surveyNumber: '',
    toOwnerAddress: '',
    toOwnerName: '',
    transferType: 'sale' as 'sale' | 'gift' | 'inheritance' | 'court_order',
    amount: 0,
    reason: ''
  });

  // Mock data
  const mockTransfers: TransferRequest[] = [
    {
      id: 'TR-001',
      surveyNumber: 'SUR-001-2024',
      fromOwner: '0x1234...5678',
      fromOwnerName: 'Sample Owner 1',
      toOwner: '0x9876...4321',
      toOwnerName: 'Sample Owner 2',
      propertyId: 'PROP-001',
      propertyAddress: 'Sector 15, Noida, UP',
      transferType: 'sale',
      amount: 5000000,
      status: 'pending',
      requestDate: '2024-08-20',
      documents: ['sale_deed.pdf', 'noc.pdf', 'payment_receipt.pdf'],
      currentStep: 1,
      estimatedValue: 5200000,
      propertyArea: 2400,
      propertyType: 'Residential',
      registrationFee: 50000,
      stampDuty: 312000
    },
    {
      id: 'TR-002',
      surveyNumber: 'SUR-002-2024',
      fromOwner: '0x5555...7777',
      fromOwnerName: 'Sample Owner 3',
      toOwner: '0x1234...5678',
      toOwnerName: 'Sample Owner 1',
      propertyId: 'PROP-002',
      propertyAddress: 'Village Khera, Noida, UP',
      transferType: 'inheritance',
      status: 'approved',
      requestDate: '2024-08-15',
      approvalDate: '2024-08-18',
      documents: ['will.pdf', 'death_cert.pdf', 'legal_heir.pdf'],
      approver: 'Registrar Office',
      currentStep: 2,
      estimatedValue: 1500000,
      propertyArea: 10800,
      propertyType: 'Agricultural',
      registrationFee: 15000,
      stampDuty: 0
    },
    {
      id: 'TR-003',
      surveyNumber: 'SUR-003-2024',
      fromOwner: '0x9999...1111',
      fromOwnerName: 'Sample Owner 4',
      toOwner: '0x2222...3333',
      toOwnerName: 'Sample Owner 5',
      propertyId: 'PROP-003',
      propertyAddress: 'IT Park, Greater Noida, UP',
      transferType: 'sale',
      amount: 25000000,
      status: 'completed',
      requestDate: '2024-08-10',
      approvalDate: '2024-08-12',
      completionDate: '2024-08-14',
      documents: ['sale_deed.pdf', 'payment_proof.pdf', 'clearance_cert.pdf'],
      approver: 'Registrar Office',
      blockchainTx: '0xabc123...def456',
      currentStep: 4,
      estimatedValue: 25000000,
      propertyArea: 5000,
      propertyType: 'Commercial',
      registrationFee: 250000,
      stampDuty: 1500000
    }
  ];

  const mockOwnershipHistory: OwnershipHistory[] = [
    {
      id: 'OH-001',
      propertyId: 'PROP-001',
      surveyNumber: 'SUR-001-2024',
      ownerName: 'Original Owner',
      ownerAddress: '0xaaaa...bbbb',
      acquisitionDate: '2020-05-15',
      acquisitionType: 'original',
      duration: '4 years 3 months',
      blockchainTx: '0x111...222',
      documents: ['original_registration.pdf']
    },
    {
      id: 'OH-002',
      propertyId: 'PROP-001',
      surveyNumber: 'SUR-001-2024',
      ownerName: 'Sample Owner 1',
      ownerAddress: '0x1234...5678',
      acquisitionDate: '2022-08-20',
      acquisitionType: 'purchase',
      transferValue: 4500000,
      duration: '2 years',
      blockchainTx: '0x333...444',
      documents: ['purchase_deed.pdf', 'payment_proof.pdf']
    }
  ];

  const mockStats: PropertyStats = {
    totalTransfers: 156,
    completedTransfers: 142,
    pendingTransfers: 14,
    totalValue: 2500000000,
    averageTransferTime: 12, // days
    successRate: 91.0
  };

  const [transfers, setTransfers] = useState<TransferRequest[]>(mockTransfers);
  const userAddress = '0x1234...5678'; // Get from Web3 context

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getTransfersByStatus = (status: string) => {
    if (status === 'all') return transfers;
    return transfers.filter(transfer => transfer.status === status);
  };

  const getMyTransfers = () => {
    return transfers.filter(transfer => 
      transfer.fromOwner === userAddress || transfer.toOwner === userAddress
    );
  };

  const handleNewTransfer = () => {
    const newTransfer: TransferRequest = {
      id: `TR-${Date.now().toString().substr(-3)}`,
      surveyNumber: newTransferData.surveyNumber,
      fromOwner: userAddress,
      fromOwnerName: 'Current User',
      toOwner: newTransferData.toOwnerAddress,
      toOwnerName: newTransferData.toOwnerName,
      propertyId: `PROP-${Date.now()}`,
      propertyAddress: 'Property Address', // Add default or fetch from survey number
      transferType: newTransferData.transferType,
      amount: newTransferData.amount,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
      documents: [],
      reason: newTransferData.reason,
      currentStep: 0
    };

    setTransfers(prev => [newTransfer, ...prev]);
    setNewTransferDialog(false);
    setNewTransferData({
      surveyNumber: '',
      toOwnerAddress: '',
      toOwnerName: '',
      transferType: 'sale',
      amount: 0,
      reason: ''
    });
  };

  const handleApproval = (transferId: string, approved: boolean, reason?: string) => {
    setTransfers(prev => prev.map(transfer => 
      transfer.id === transferId 
        ? {
            ...transfer,
            status: approved ? 'approved' : 'rejected',
            approvalDate: new Date().toISOString().split('T')[0],
            approver: 'Current Registrar',
            reason: reason || transfer.reason,
            currentStep: approved ? 2 : -1
          }
        : transfer
    ));
    setApprovalDialog(false);
    setSelectedTransfer(null);
  };

  const completeTransfer = (transferId: string) => {
    setTransfers(prev => prev.map(transfer => 
      transfer.id === transferId 
        ? {
            ...transfer,
            status: 'completed',
            completionDate: new Date().toISOString().split('T')[0],
            blockchainTx: `0x${Math.random().toString(16).substr(2, 40)}`,
            currentStep: 4
          }
        : transfer
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'completed': return 'success';
      case 'rejected': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getTransferSteps = (transferType: string) => [
    'Request Submitted',
    'Document Verification',
    'Authority Approval',
    'Blockchain Recording',
    'Transfer Complete'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderTransferCard = (transfer: TransferRequest) => (
    <Card key={transfer.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              {transfer.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Survey: {transfer.surveyNumber}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={transfer.status.toUpperCase()} 
              color={getStatusColor(transfer.status) as any}
              size="small"
            />
            <IconButton
              onClick={(e) => {
                setActionMenuAnchor(e.currentTarget);
                setSelectedTransfer(transfer);
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" gutterBottom>
              <strong>From:</strong> {transfer.fromOwnerName} ({transfer.fromOwner})
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>To:</strong> {transfer.toOwnerName} ({transfer.toOwner})
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" gutterBottom>
              <strong>Type:</strong> {transfer.transferType.replace('_', ' ').toUpperCase()}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Request Date:</strong> {transfer.requestDate}
            </Typography>
          </Grid>
        </Grid>

        {transfer.amount && (
          <Box sx={{ p: 2, bgcolor: 'rgba(0, 212, 255, 0.1)', borderRadius: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'primary.main' }}>
              Amount: {formatCurrency(transfer.amount)}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Transfer Progress
          </Typography>
          <Stepper activeStep={transfer.currentStep} orientation="horizontal">
            {getTransferSteps(transfer.transferType).map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => {
              setSelectedTransfer(transfer);
              setDetailsDialog(true);
            }}
          >
            View Details
          </Button>
          
          {transfer.status === 'pending' && (
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<Check />}
              onClick={() => {
                setSelectedTransfer(transfer);
                setApprovalDialog(true);
              }}
            >
              Review
            </Button>
          )}

          {transfer.status === 'approved' && (
            <Button
              size="small"
              variant="contained"
              startIcon={<AccountBalance />}
              onClick={() => completeTransfer(transfer.id)}
            >
              Complete Transfer
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              background: 'linear-gradient(45deg, #00D4FF, #6C5CE7, #00B894)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            🔄 Land Transfers
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage land ownership transfers and track their progress
          </Typography>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="All Transfers" />
            <Tab label="My Transfers" />
            <Tab label="Pending Approval" />
            <Tab label="Completed" />
          </Tabs>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setNewTransferDialog(true)}
          >
            New Transfer
          </Button>
        </Box>

        <TabPanel value={currentTab} index={0}>
          {getTransfersByStatus('all').map(renderTransferCard)}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {getMyTransfers().map(renderTransferCard)}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {getTransfersByStatus('pending').map(renderTransferCard)}
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          {getTransfersByStatus('completed').map(renderTransferCard)}
        </TabPanel>

        {/* New Transfer Dialog */}
        <Dialog 
          open={newTransferDialog} 
          onClose={() => setNewTransferDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SwapHoriz color="primary" />
              <Typography variant="h6">Initiate Land Transfer</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Survey Number"
                  value={newTransferData.surveyNumber}
                  onChange={(e) => setNewTransferData(prev => ({ ...prev, surveyNumber: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Transfer Type"
                  value={newTransferData.transferType}
                  onChange={(e) => setNewTransferData(prev => ({ ...prev, transferType: e.target.value as any }))}
                >
                  <MenuItem value="sale">Sale</MenuItem>
                  <MenuItem value="gift">Gift</MenuItem>
                  <MenuItem value="inheritance">Inheritance</MenuItem>
                  <MenuItem value="court_order">Court Order</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="To Owner Address"
                  value={newTransferData.toOwnerAddress}
                  onChange={(e) => setNewTransferData(prev => ({ ...prev, toOwnerAddress: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="To Owner Name"
                  value={newTransferData.toOwnerName}
                  onChange={(e) => setNewTransferData(prev => ({ ...prev, toOwnerName: e.target.value }))}
                  required
                />
              </Grid>
              {newTransferData.transferType === 'sale' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Transfer Amount (INR)"
                    type="number"
                    value={newTransferData.amount}
                    onChange={(e) => setNewTransferData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason / Notes"
                  value={newTransferData.reason}
                  onChange={(e) => setNewTransferData(prev => ({ ...prev, reason: e.target.value }))}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewTransferDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleNewTransfer}>
              Submit Transfer Request
            </Button>
          </DialogActions>
        </Dialog>

        {/* Transfer Details Dialog */}
        <Dialog
          open={detailsDialog}
          onClose={() => setDetailsDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Transfer Details - {selectedTransfer?.id}
          </DialogTitle>
          <DialogContent>
            {selectedTransfer && (
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ mr: 1 }} color="primary" />
                          Transfer Information
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Survey Number:</strong> {selectedTransfer.surveyNumber}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Transfer Type:</strong> {selectedTransfer.transferType.replace('_', ' ').toUpperCase()}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Status:</strong> 
                          <Chip 
                            label={selectedTransfer.status.toUpperCase()} 
                            color={getStatusColor(selectedTransfer.status) as any}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Typography>
                        {selectedTransfer.amount && (
                          <Typography variant="body2" gutterBottom>
                            <strong>Amount:</strong> {formatCurrency(selectedTransfer.amount)}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <Schedule sx={{ mr: 1 }} color="primary" />
                          Timeline
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Request Date:</strong> {selectedTransfer.requestDate}
                        </Typography>
                        {selectedTransfer.approvalDate && (
                          <Typography variant="body2" gutterBottom>
                            <strong>Approval Date:</strong> {selectedTransfer.approvalDate}
                          </Typography>
                        )}
                        {selectedTransfer.completionDate && (
                          <Typography variant="body2" gutterBottom>
                            <strong>Completion Date:</strong> {selectedTransfer.completionDate}
                          </Typography>
                        )}
                        {selectedTransfer.approver && (
                          <Typography variant="body2" gutterBottom>
                            <strong>Approved By:</strong> {selectedTransfer.approver}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <SwapHoriz sx={{ mr: 1 }} color="primary" />
                          Parties Involved
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box>
                            <Typography variant="subtitle1" gutterBottom>From (Current Owner)</Typography>
                            <Typography variant="body2">{selectedTransfer.fromOwnerName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {selectedTransfer.fromOwner}
                            </Typography>
                          </Box>
                          <SwapHoriz color="primary" sx={{ mx: 2 }} />
                          <Box>
                            <Typography variant="subtitle1" gutterBottom>To (New Owner)</Typography>
                            <Typography variant="body2">{selectedTransfer.toOwnerName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {selectedTransfer.toOwner}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {selectedTransfer.documents.length > 0 && (
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <Description sx={{ mr: 1 }} color="primary" />
                            Documents ({selectedTransfer.documents.length})
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedTransfer.documents.map((doc, index) => (
                              <Chip
                                key={index}
                                label={doc}
                                color="primary"
                                variant="outlined"
                                size="small"
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {selectedTransfer.blockchainTx && (
                    <Grid item xs={12}>
                      <Alert severity="success">
                        <strong>Blockchain Transaction:</strong> {selectedTransfer.blockchainTx}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Approval Dialog */}
        <Dialog
          open={approvalDialog}
          onClose={() => setApprovalDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Review Transfer Request
          </DialogTitle>
          <DialogContent>
            {selectedTransfer && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedTransfer.id} - {selectedTransfer.surveyNumber}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Transfer from {selectedTransfer.fromOwnerName} to {selectedTransfer.toOwnerName}
                </Typography>
                {selectedTransfer.amount && (
                  <Typography variant="body2" gutterBottom>
                    Amount: {formatCurrency(selectedTransfer.amount)}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  label="Approval/Rejection Notes"
                  multiline
                  rows={3}
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => handleApproval(selectedTransfer?.id || '', false)}
              color="error"
              startIcon={<Close />}
            >
              Reject
            </Button>
            <Button 
              onClick={() => handleApproval(selectedTransfer?.id || '', true)}
              variant="contained"
              startIcon={<Check />}
            >
              Approve
            </Button>
          </DialogActions>
        </Dialog>

        {/* Action Menu */}
        <Menu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={() => setActionMenuAnchor(null)}
        >
          <MenuItem onClick={() => {
            setDetailsDialog(true);
            setActionMenuAnchor(null);
          }}>
            <Visibility sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          {selectedTransfer?.status === 'pending' && (
            <MenuItem onClick={() => {
              setApprovalDialog(true);
              setActionMenuAnchor(null);
            }}>
              <Gavel sx={{ mr: 1 }} />
              Review Transfer
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Container>
  );
};

export default TransfersPage;
