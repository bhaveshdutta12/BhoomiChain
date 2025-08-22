import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Badge,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Dashboard,
  Assessment,
  VerifiedUser,
  PendingActions,
  AccountBalance,
  Business,
  Person,
  LocationOn,
  CalendarToday,
  CheckCircle,
  Cancel,
  Schedule,
  TrendingUp,
  TrendingDown,
  Visibility,
  Edit,
  Delete,
  Add,
  FilterList,
  Download,
  Refresh,
  BarChart,
  PieChart,
  Timeline,
  Map,
  Security,
  Gavel,
  Description,
  AttachFile,
  Search,
  FilterAlt
} from '@mui/icons-material';
import { UserRole, DashboardStats, DepartmentStats, VerificationRequest, TransferApproval } from '../types';
import { useAuth } from '../contexts/AuthContext';

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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const GovernmentDashboardPage: React.FC = () => {
  const { user, hasPermission, hasRole } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [selectedTransfer, setSelectedTransfer] = null>(null);
  const [commentDialog, setCommentDialog] = useState(false);
  const [comment, setComment] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API calls
  const [dashboardStats] = useState<DashboardStats>({
    totalLands: 15420,
    verifiedLands: 12850,
    pendingVerifications: 2340,
    disputedLands: 230,
    totalTransfers: 5670,
    pendingTransfers: 890,
    totalUsers: 45600,
    activeUsers: 38900
  });

  const [departmentStats] = useState<DepartmentStats[]>([
    { departmentId: '1', departmentName: 'Land Revenue', totalLands: 5200, verifiedLands: 4800, pendingVerifications: 320, disputedLands: 80 },
    { departmentId: '2', departmentName: 'Urban Development', totalLands: 3800, verifiedLands: 3200, pendingVerifications: 450, disputedLands: 150 },
    { departmentId: '3', departmentName: 'Rural Development', totalLands: 4200, verifiedLands: 3500, pendingVerifications: 580, disputedLands: 120 },
    { departmentId: '4', departmentName: 'Forest Department', totalLands: 2200, verifiedLands: 1350, pendingVerifications: 990, disputedLands: 140 }
  ]);

  const [verificationRequests] = useState<VerificationRequest[]>([
    {
      id: '1',
      landId: 12345,
      surveyNumber: 'SR-2024-001',
      location: 'Mumbai, Maharashtra',
      area: 2500,
      currentOwner: 'Rajesh Kumar',
      requestDate: '2024-01-15',
      status: 'pending',
      documents: [{ filename: 'land_document.pdf', hash: 'abc123', size: 1024000, type: 'application/pdf', uploadedAt: '2024-01-15' }]
    },
    {
      id: '2',
      landId: 12346,
      surveyNumber: 'SR-2024-002',
      location: 'Pune, Maharashtra',
      area: 1800,
      currentOwner: 'Priya Sharma',
      requestDate: '2024-01-14',
      status: 'pending',
      documents: [{ filename: 'ownership_proof.pdf', hash: 'def456', size: 2048000, type: 'application/pdf', uploadedAt: '2024-01-14' }]
    }
  ]);

  const [transferApprovals] = useState<TransferApproval[]>([
    {
      id: '1',
      transferId: 'TR-2024-001',
      landId: 12347,
      surveyNumber: 'SR-2024-003',
      from: 'Amit Patel',
      to: 'Sneha Desai',
      requestDate: '2024-01-13',
      status: 'pending',
      documents: [{ filename: 'transfer_deed.pdf', hash: 'ghi789', size: 1536000, type: 'application/pdf', uploadedAt: '2024-01-13' }]
    }
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleStatusChange = async (requestId: string, newStatus: string, type: 'verification' | 'transfer') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      if (type === 'verification') {
        // Update verification request status
        console.log(`Updated verification request ${requestId} to ${newStatus}`);
      } else {
        // Update transfer approval status
        console.log(`Updated transfer approval ${requestId} to ${newStatus}`);
      }
      
      setCommentDialog(false);
      setComment('');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Schedule />;
      case 'approved': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const renderOverviewCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Total Lands
                </Typography>
                <Typography variant="h4">
                  {dashboardStats.totalLands.toLocaleString()}
                </Typography>
              </Box>
              <LocationOn color="primary" sx={{ fontSize: 40 }} />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(dashboardStats.verifiedLands / dashboardStats.totalLands) * 100} 
              sx={{ mt: 2 }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {((dashboardStats.verifiedLands / dashboardStats.totalLands) * 100).toFixed(1)}% Verified
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Pending Verifications
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {dashboardStats.pendingVerifications.toLocaleString()}
                </Typography>
              </Box>
              <PendingActions color="warning" sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {((dashboardStats.pendingVerifications / dashboardStats.totalLands) * 100).toFixed(1)}% of total
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Total Transfers
                </Typography>
                <Typography variant="h4" color="info.main">
                  {dashboardStats.totalTransfers.toLocaleString()}
                </Typography>
              </Box>
              <AccountBalance color="info" sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {dashboardStats.pendingTransfers} pending approval
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Active Users
                </Typography>
                <Typography variant="h4" color="success.main">
                  {dashboardStats.activeUsers.toLocaleString()}
                </Typography>
              </Box>
              <Person color="success" sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {((dashboardStats.activeUsers / dashboardStats.totalUsers) * 100).toFixed(1)}% of total users
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderDepartmentStats = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {departmentStats.map((dept) => (
        <Grid item xs={12} md={6} key={dept.departmentId}>
          <Card>
            <CardHeader
              title={dept.departmentName}
              subheader={`${dept.totalLands} total lands`}
              action={
                <IconButton>
                  <Visibility />
                </IconButton>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6" color="success.main">
                    {dept.verifiedLands}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Verified
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" color="warning.main">
                    {dept.pendingVerifications}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Pending
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" color="error.main">
                    {dept.disputedLands}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Disputed
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" color="info.main">
                    {((dept.verifiedLands / dept.totalLands) * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Completion
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderVerificationRequests = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Land Verification Requests</Typography>
        <Box>
          <TextField
            size="small"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ mr: 2 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Survey Number</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Area (sq ft)</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {verificationRequests
              .filter(req => filterStatus === 'all' || req.status === filterStatus)
              .filter(req => 
                req.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.currentOwner.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.surveyNumber}</TableCell>
                  <TableCell>{request.location}</TableCell>
                  <TableCell>{request.currentOwner}</TableCell>
                  <TableCell>{request.area.toLocaleString()}</TableCell>
                  <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(request.status)}
                      label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      color={getStatusColor(request.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`${request.documents.length} document(s)`}>
                      <Badge badgeContent={request.documents.length} color="primary">
                        <Description />
                      </Badge>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                                             {request.status === 'pending' && hasPermission('verify_land') && (
                         <>
                           <Tooltip title="Approve">
                             <IconButton
                               size="small"
                               color="success"
                               onClick={() => handleStatusChange(request.id, 'approved', 'verification')}
                             >
                               <CheckCircle />
                             </IconButton>
                           </Tooltip>
                           <Tooltip title="Reject">
                             <IconButton
                               size="small"
                               color="error"
                               onClick={() => setCommentDialog(true)}
                             >
                               <Cancel />
                             </IconButton>
                           </Tooltip>
                         </>
                       )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderTransferApprovals = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Transfer Approval Requests</Typography>
        <Button
          variant="outlined"
          startIcon={<FilterAlt />}
          size="small"
        >
          Filter
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transfer ID</TableCell>
              <TableCell>Survey Number</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transferApprovals.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell>{transfer.transferId}</TableCell>
                <TableCell>{transfer.surveyNumber}</TableCell>
                <TableCell>{transfer.from}</TableCell>
                <TableCell>{transfer.to}</TableCell>
                <TableCell>{new Date(transfer.requestDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(transfer.status)}
                    label={transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                    color={getStatusColor(transfer.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title={`${transfer.documents.length} document(s)`}>
                    <Badge badgeContent={transfer.documents.length} color="primary">
                      <Description />
                    </Badge>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                                         {transfer.status === 'pending' && hasPermission('approve_transfer') && (
                       <>
                         <Tooltip title="Approve">
                           <IconButton
                             size="small"
                             color="success"
                             onClick={() => handleStatusChange(transfer.id, 'approved', 'transfer')}
                           >
                             <CheckCircle />
                           </IconButton>
                         </Tooltip>
                         <Tooltip title="Reject">
                           <IconButton
                             size="small"
                             color="error"
                             onClick={() => setCommentDialog(true)}
                           >
                             <Cancel />
                           </IconButton>
                         </Tooltip>
                       </>
                     )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Check if user has access to government dashboard
  if (!user || (!hasRole(UserRole.GOVERNMENT_OFFICIAL) && 
                !hasRole(UserRole.DEPARTMENT_HEAD) && 
                !hasRole(UserRole.REGISTRAR) && 
                !hasRole(UserRole.ADMIN))) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You don't have permission to access the government dashboard. 
          Please contact your administrator for access.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Government Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome, {user.name} ({user.role.replace('_', ' ').toUpperCase()})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comprehensive overview of land registry operations and pending approvals
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 4 }}
        >
          <Tab
            icon={<Dashboard />}
            label="Overview"
            iconPosition="start"
          />
          <Tab
            icon={<Assessment />}
            label="Department Stats"
            iconPosition="start"
          />
          <Tab
            icon={<VerifiedUser />}
            label="Verifications"
            iconPosition="start"
          />
          <Tab
            icon={<AccountBalance />}
            label="Transfers"
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          {renderOverviewCards()}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Recent Activity" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <VerifiedUser color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Land verification approved"
                        secondary="SR-2024-001 - 2 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccountBalance color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Transfer request received"
                        secondary="TR-2024-002 - 4 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Security color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="New dispute filed"
                        secondary="Land ID: 12348 - 6 hours ago"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Quick Actions" />
                <CardContent>
                                     <Grid container spacing={2}>
                     {hasPermission('verify_land') && (
                       <Grid item xs={6}>
                         <Button
                           fullWidth
                           variant="outlined"
                           startIcon={<Add />}
                           size="large"
                         >
                           New Verification
                         </Button>
                       </Grid>
                     )}
                     <Grid item xs={6}>
                       <Button
                         fullWidth
                         variant="outlined"
                         startIcon={<Download />}
                         size="large"
                       >
                         Export Report
                       </Button>
                     </Grid>
                     <Grid item xs={6}>
                       <Button
                         fullWidth
                         variant="outlined"
                         startIcon={<Refresh />}
                         size="large"
                       >
                         Refresh Data
                       </Button>
                     </Grid>
                     {hasPermission('view_department_stats') && (
                       <Grid item xs={6}>
                         <Button
                           fullWidth
                           variant="outlined"
                           startIcon={<BarChart />}
                           size="large"
                         >
                           View Analytics
                         </Button>
                       </Grid>
                     )}
                   </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {hasPermission('view_department_stats') ? (
            renderDepartmentStats()
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                You don't have permission to view department statistics.
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {hasPermission('verify_land') ? (
            renderVerificationRequests()
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                You don't have permission to view verification requests.
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          {hasPermission('approve_transfer') ? (
            renderTransferApprovals()
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                You don't have permission to view transfer approvals.
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Verification Request Details Dialog */}
      <Dialog
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              Land Verification Details - {selectedRequest.surveyNumber}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Survey Number
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedRequest.surveyNumber}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="textSecondary">
                    Location
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedRequest.location}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="textSecondary">
                    Current Owner
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedRequest.currentOwner}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Area
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedRequest.area.toLocaleString()} sq ft
                  </Typography>
                  
                  <Typography variant="subtitle2" color="textSecondary">
                    Request Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedRequest.requestDate).toLocaleDateString()}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedRequest.status)}
                    label={selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    color={getStatusColor(selectedRequest.status) as any}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Documents
                  </Typography>
                  <List>
                    {selectedRequest.documents.map((doc, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AttachFile />
                        </ListItemIcon>
                        <ListItemText
                          primary={doc.filename}
                          secondary={`${(doc.size / 1024 / 1024).toFixed(2)} MB - ${doc.type}`}
                        />
                        <Button size="small" variant="outlined">
                          View
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
                         <DialogActions>
               <Button onClick={() => setSelectedRequest(null)}>Close</Button>
               {selectedRequest.status === 'pending' && hasPermission('verify_land') && (
                 <>
                   <Button
                     color="success"
                     variant="contained"
                     onClick={() => handleStatusChange(selectedRequest.id, 'approved', 'verification')}
                   >
                     Approve
                   </Button>
                   <Button
                     color="error"
                     variant="outlined"
                     onClick={() => setCommentDialog(true)}
                   >
                     Reject
                   </Button>
                 </>
               )}
             </DialogActions>
          </>
        )}
      </Dialog>

      {/* Comment Dialog for Rejections */}
      <Dialog
        open={commentDialog}
        onClose={() => setCommentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Rejection Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for rejection"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Please provide a reason for rejecting this request..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialog(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (comment.trim()) {
                handleStatusChange(selectedRequest?.id || '', 'rejected', 'verification');
              }
            }}
            disabled={!comment.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GovernmentDashboardPage;
