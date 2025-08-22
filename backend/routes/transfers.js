const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const blockchainService = require('../utils/blockchain');

// Validation middleware
const validateTransferRequest = [
  body('newOwner').isEthereumAddress().withMessage('Valid Ethereum address required for new owner'),
  body('reason').notEmpty().withMessage('Reason for transfer is required')
];

// @route   POST /api/transfers/:landId/request
// @desc    Request transfer of land ownership
// @access  Private (Land owner only)
router.post('/:landId/request', validateTransferRequest, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const landId = parseInt(req.params.landId);
    const { newOwner, reason } = req.body;

    if (isNaN(landId) || landId <= 0) {
      return res.status(400).json({ error: 'Invalid land ID' });
    }

    // Check if land exists
    const land = await blockchainService.getLand(landId);
    
    // Check if there's already a pending transfer
    try {
      const existingRequest = await blockchainService.getTransferRequest(landId);
      if (existingRequest.from !== '0x0000000000000000000000000000000000000000' && 
          !existingRequest.isCompleted) {
        return res.status(409).json({ error: 'Transfer request already exists for this land' });
      }
    } catch (error) {
      // No existing request, which is fine
    }

    // Request transfer
    const result = await blockchainService.requestTransfer(landId, newOwner, reason);

    res.status(201).json({
      message: 'Transfer request submitted successfully',
      landId,
      newOwner,
      reason,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      gasUsed: result.gasUsed
    });

  } catch (error) {
    console.error('Error requesting transfer:', error);
    
    if (error.message.includes('Land does not exist')) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    if (error.message.includes('Not the land owner')) {
      return res.status(403).json({ error: 'Only the land owner can request transfer' });
    }
    
    if (error.message.includes('Land not available for transfer')) {
      return res.status(409).json({ error: 'Land is not available for transfer' });
    }
    
    res.status(500).json({ error: 'Failed to request transfer' });
  }
});

// @route   POST /api/transfers/:landId/approve
// @desc    Approve a transfer request
// @access  Private (Government officials only)
router.post('/:landId/approve', async (req, res) => {
  try {
    const landId = parseInt(req.params.landId);

    if (isNaN(landId) || landId <= 0) {
      return res.status(400).json({ error: 'Invalid land ID' });
    }

    // Check if transfer request exists
    const transferRequest = await blockchainService.getTransferRequest(landId);
    
    if (transferRequest.from === '0x0000000000000000000000000000000000000000') {
      return res.status(404).json({ error: 'No transfer request found for this land' });
    }

    if (transferRequest.isApproved) {
      return res.status(409).json({ error: 'Transfer request is already approved' });
    }

    if (transferRequest.isCompleted) {
      return res.status(409).json({ error: 'Transfer has already been completed' });
    }

    // Approve transfer
    const result = await blockchainService.approveTransfer(landId);

    res.json({
      message: 'Transfer request approved successfully',
      landId,
      from: transferRequest.from,
      to: transferRequest.to,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      gasUsed: result.gasUsed
    });

  } catch (error) {
    console.error('Error approving transfer:', error);
    
    if (error.message.includes('Land does not exist')) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    if (error.message.includes('No transfer request found')) {
      return res.status(404).json({ error: 'No transfer request found for this land' });
    }
    
    if (error.message.includes('Already approved')) {
      return res.status(409).json({ error: 'Transfer request is already approved' });
    }
    
    res.status(500).json({ error: 'Failed to approve transfer' });
  }
});

// @route   POST /api/transfers/:landId/complete
// @desc    Complete a transfer (finalize ownership change)
// @access  Private (Government officials only)
router.post('/:landId/complete', async (req, res) => {
  try {
    const landId = parseInt(req.params.landId);

    if (isNaN(landId) || landId <= 0) {
      return res.status(400).json({ error: 'Invalid land ID' });
    }

    // Check if transfer request exists and is approved
    const transferRequest = await blockchainService.getTransferRequest(landId);
    
    if (transferRequest.from === '0x0000000000000000000000000000000000000000') {
      return res.status(404).json({ error: 'No transfer request found for this land' });
    }

    if (!transferRequest.isApproved) {
      return res.status(409).json({ error: 'Transfer request must be approved before completion' });
    }

    if (transferRequest.isCompleted) {
      return res.status(409).json({ error: 'Transfer has already been completed' });
    }

    // Complete transfer
    const result = await blockchainService.completeTransfer(landId);

    res.json({
      message: 'Transfer completed successfully',
      landId,
      previousOwner: transferRequest.from,
      newOwner: transferRequest.to,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      gasUsed: result.gasUsed
    });

  } catch (error) {
    console.error('Error completing transfer:', error);
    
    if (error.message.includes('Land does not exist')) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    if (error.message.includes('No transfer request found')) {
      return res.status(404).json({ error: 'No transfer request found for this land' });
    }
    
    if (error.message.includes('Transfer not approved')) {
      return res.status(409).json({ error: 'Transfer request must be approved before completion' });
    }
    
    if (error.message.includes('Transfer already completed')) {
      return res.status(409).json({ error: 'Transfer has already been completed' });
    }
    
    res.status(500).json({ error: 'Failed to complete transfer' });
  }
});

// @route   GET /api/transfers/:landId
// @desc    Get transfer request details for a land
// @access  Public
router.get('/:landId', async (req, res) => {
  try {
    const landId = parseInt(req.params.landId);

    if (isNaN(landId) || landId <= 0) {
      return res.status(400).json({ error: 'Invalid land ID' });
    }

    // Check if land exists
    const land = await blockchainService.getLand(landId);

    // Get transfer request
    const transferRequest = await blockchainService.getTransferRequest(landId);
    
    if (transferRequest.from === '0x0000000000000000000000000000000000000000') {
      return res.status(404).json({ error: 'No transfer request found for this land' });
    }

    res.json({
      landId,
      transferRequest,
      land: {
        surveyNumber: land.surveyNumber,
        location: land.location,
        currentOwner: land.currentOwner,
        status: land.status
      }
    });

  } catch (error) {
    console.error('Error fetching transfer request:', error);
    
    if (error.message.includes('Land does not exist')) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    res.status(500).json({ error: 'Failed to fetch transfer request' });
  }
});

// @route   GET /api/transfers
// @desc    Get all pending transfer requests (for officials)
// @access  Private (Government officials only)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // 'pending', 'approved', 'completed'

    const totalLands = await blockchainService.getTotalLands();
    const transfers = [];

    // Fetch all lands and check for transfer requests
    for (let i = 1; i <= totalLands; i++) {
      try {
        const land = await blockchainService.getLand(i);
        const transferRequest = await blockchainService.getTransferRequest(i);
        
        // Skip if no transfer request
        if (transferRequest.from === '0x0000000000000000000000000000000000000000') {
          continue;
        }

        // Apply status filter
        if (status) {
          if (status === 'pending' && (transferRequest.isApproved || transferRequest.isCompleted)) {
            continue;
          }
          if (status === 'approved' && (!transferRequest.isApproved || transferRequest.isCompleted)) {
            continue;
          }
          if (status === 'completed' && !transferRequest.isCompleted) {
            continue;
          }
        }

        transfers.push({
          landId: i,
          land: {
            surveyNumber: land.surveyNumber,
            location: land.location,
            area: land.area,
            currentOwner: land.currentOwner
          },
          transferRequest
        });
      } catch (error) {
        console.error(`Error processing land ${i}:`, error);
      }
    }

    // Sort by request date (newest first)
    transfers.sort((a, b) => new Date(b.transferRequest.requestDate) - new Date(a.transferRequest.requestDate));

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransfers = transfers.slice(startIndex, endIndex);

    res.json({
      transfers: paginatedTransfers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(transfers.length / limit),
        total: transfers.length,
        hasNext: endIndex < transfers.length,
        hasPrev: page > 1
      },
      filter: {
        status: status || 'all'
      }
    });

  } catch (error) {
    console.error('Error fetching transfer requests:', error);
    res.status(500).json({ error: 'Failed to fetch transfer requests' });
  }
});

// @route   GET /api/transfers/owner/:address
// @desc    Get transfer requests by owner address
// @access  Public
router.get('/owner/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const landIds = await blockchainService.getLandsByOwner(address);
    const transfers = [];

    // Check each land for transfer requests
    for (const landId of landIds) {
      try {
        const land = await blockchainService.getLand(landId);
        const transferRequest = await blockchainService.getTransferRequest(landId);
        
        // Skip if no transfer request
        if (transferRequest.from === '0x0000000000000000000000000000000000000000') {
          continue;
        }

        transfers.push({
          landId,
          land: {
            surveyNumber: land.surveyNumber,
            location: land.location,
            area: land.area
          },
          transferRequest
        });
      } catch (error) {
        console.error(`Error processing land ${landId}:`, error);
      }
    }

    // Sort by request date (newest first)
    transfers.sort((a, b) => new Date(b.transferRequest.requestDate) - new Date(a.transferRequest.requestDate));

    res.json({
      transfers,
      count: transfers.length,
      owner: address
    });

  } catch (error) {
    console.error('Error fetching transfers by owner:', error);
    res.status(500).json({ error: 'Failed to fetch transfers' });
  }
});

module.exports = router;
