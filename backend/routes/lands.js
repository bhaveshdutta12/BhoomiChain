const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const blockchainService = require('../utils/blockchain');
const ipfsService = require('../utils/ipfs');

// Initialize IPFS service
ipfsService.init();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image files and PDFs are allowed!'), false);
    }
  }
});

// Validation middleware
const validateLandRegistration = [
  body('surveyNumber').notEmpty().withMessage('Survey number is required'),
  body('owner').isEthereumAddress().withMessage('Valid Ethereum address required for owner'),
  body('location').notEmpty().withMessage('Location is required'),
  body('area').isNumeric().withMessage('Area must be a number'),
  body('gpsCoordinates').matches(/^-?\d+\.?\d*,-?\d+\.?\d*$/).withMessage('GPS coordinates must be in format: lat,lng'),
  body('marketValue').isNumeric().withMessage('Market value must be a number')
];

// @route   GET /api/lands
// @desc    Get all lands with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const totalLands = await blockchainService.getTotalLands();
    const totalPages = Math.ceil(totalLands / limit);
    
    const lands = [];
    const start = (page - 1) * limit + 1;
    const end = Math.min(start + limit - 1, totalLands);
    
    for (let i = start; i <= end; i++) {
      try {
        const land = await blockchainService.getLand(i);
        lands.push(land);
      } catch (error) {
        console.error(`Error fetching land ${i}:`, error);
      }
    }

    res.json({
      lands,
      pagination: {
        currentPage: page,
        totalPages,
        totalLands,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching lands:', error);
    res.status(500).json({ error: 'Failed to fetch lands' });
  }
});

// @route   GET /api/lands/:id
// @desc    Get land by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const landId = parseInt(req.params.id);
    
    if (isNaN(landId) || landId <= 0) {
      return res.status(400).json({ error: 'Invalid land ID' });
    }

    const land = await blockchainService.getLand(landId);
    
    // Get transfer request if exists
    let transferRequest = null;
    try {
      transferRequest = await blockchainService.getTransferRequest(landId);
      if (transferRequest.from === '0x0000000000000000000000000000000000000000') {
        transferRequest = null;
      }
    } catch (error) {
      // No transfer request exists
    }

    res.json({
      land,
      transferRequest
    });
  } catch (error) {
    console.error('Error fetching land:', error);
    
    if (error.message.includes('Land does not exist')) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    res.status(500).json({ error: 'Failed to fetch land details' });
  }
});

// @route   GET /api/lands/survey/:surveyNumber
// @desc    Get land by survey number
// @access  Public
router.get('/survey/:surveyNumber', async (req, res) => {
  try {
    const { surveyNumber } = req.params;
    
    const landId = await blockchainService.getLandIdBySurveyNumber(surveyNumber);
    
    if (landId === 0) {
      return res.status(404).json({ error: 'Land with this survey number not found' });
    }
    
    const land = await blockchainService.getLand(landId);
    res.json(land);
  } catch (error) {
    console.error('Error fetching land by survey number:', error);
    res.status(500).json({ error: 'Failed to fetch land details' });
  }
});

// @route   GET /api/lands/owner/:address
// @desc    Get lands by owner address
// @access  Public
router.get('/owner/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const landIds = await blockchainService.getLandsByOwner(address);
    
    const lands = [];
    for (const landId of landIds) {
      try {
        const land = await blockchainService.getLand(landId);
        lands.push(land);
      } catch (error) {
        console.error(`Error fetching land ${landId}:`, error);
      }
    }

    res.json({ lands, count: lands.length });
  } catch (error) {
    console.error('Error fetching lands by owner:', error);
    res.status(500).json({ error: 'Failed to fetch owner lands' });
  }
});

// @route   POST /api/lands/register
// @desc    Register new land
// @access  Private (Government officials only)
router.post('/register', upload.array('documents', 5), validateLandRegistration, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { surveyNumber, owner, location, area, gpsCoordinates, marketValue } = req.body;

    // Check if survey number already exists
    try {
      const existingLandId = await blockchainService.getLandIdBySurveyNumber(surveyNumber);
      if (existingLandId !== 0) {
        return res.status(409).json({ error: 'Land with this survey number already exists' });
      }
    } catch (error) {
      // Survey number doesn't exist, which is what we want
    }

    // Upload documents to IPFS
    let ipfsHash = '';
    if (req.files && req.files.length > 0) {
      try {
        // Create a metadata object with all documents
        const documents = [];
        
        for (const file of req.files) {
          const fileResult = await ipfsService.uploadFile(file.path, file.originalname);
          documents.push({
            filename: file.originalname,
            hash: fileResult.hash,
            size: fileResult.size,
            type: file.mimetype,
            uploadedAt: new Date().toISOString()
          });
        }

        // Upload metadata as JSON
        const metadata = {
          surveyNumber,
          location,
          area: parseInt(area),
          gpsCoordinates,
          marketValue: parseFloat(marketValue),
          documents,
          registrationDate: new Date().toISOString()
        };

        const metadataResult = await ipfsService.uploadJSON(
          metadata, 
          `land-${surveyNumber}-metadata.json`
        );
        
        ipfsHash = metadataResult.hash;
        
        // Pin the metadata file
        await ipfsService.pinFile(ipfsHash);
        
      } catch (error) {
        console.error('Error uploading to IPFS:', error);
        return res.status(500).json({ error: 'Failed to upload documents to IPFS' });
      }
    }

    // Register land on blockchain
    const landData = {
      surveyNumber,
      owner,
      location,
      area: parseInt(area),
      ipfsHash,
      gpsCoordinates,
      marketValue: parseFloat(marketValue)
    };

    const result = await blockchainService.registerLand(landData);

    res.status(201).json({
      message: 'Land registered successfully',
      landId: result.landId,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      gasUsed: result.gasUsed,
      ipfsHash,
      ipfsUrl: ipfsHash ? ipfsService.getPublicURL(ipfsHash) : null
    });

  } catch (error) {
    console.error('Error registering land:', error);
    
    if (error.message.includes('Land already registered')) {
      return res.status(409).json({ error: 'Land with this survey number already exists' });
    }
    
    res.status(500).json({ error: 'Failed to register land' });
  }
});

// @route   POST /api/lands/:id/verify
// @desc    Verify a land property
// @access  Private (Government officials only)
router.post('/:id/verify', async (req, res) => {
  try {
    const landId = parseInt(req.params.id);
    
    if (isNaN(landId) || landId <= 0) {
      return res.status(400).json({ error: 'Invalid land ID' });
    }

    // Check if land exists and is not already verified
    const land = await blockchainService.getLand(landId);
    
    if (land.isVerified) {
      return res.status(409).json({ error: 'Land is already verified' });
    }

    const result = await blockchainService.verifyLand(landId);

    res.json({
      message: 'Land verified successfully',
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      gasUsed: result.gasUsed
    });

  } catch (error) {
    console.error('Error verifying land:', error);
    
    if (error.message.includes('Land does not exist')) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    if (error.message.includes('Land already verified')) {
      return res.status(409).json({ error: 'Land is already verified' });
    }
    
    res.status(500).json({ error: 'Failed to verify land' });
  }
});

// @route   PUT /api/lands/:id/documents
// @desc    Update documents for a land
// @access  Private (Government officials only)
router.put('/:id/documents', upload.array('documents', 5), async (req, res) => {
  try {
    const landId = parseInt(req.params.id);
    
    if (isNaN(landId) || landId <= 0) {
      return res.status(400).json({ error: 'Invalid land ID' });
    }

    // Check if land exists
    const land = await blockchainService.getLand(landId);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No documents provided' });
    }

    // Upload new documents to IPFS
    const documents = [];
    
    for (const file of req.files) {
      const fileResult = await ipfsService.uploadFile(file.path, file.originalname);
      documents.push({
        filename: file.originalname,
        hash: fileResult.hash,
        size: fileResult.size,
        type: file.mimetype,
        uploadedAt: new Date().toISOString()
      });
    }

    // Create updated metadata
    let existingMetadata = {};
    if (land.ipfsHash) {
      try {
        existingMetadata = await ipfsService.getJSON(land.ipfsHash);
      } catch (error) {
        console.error('Error fetching existing metadata:', error);
      }
    }

    const updatedMetadata = {
      ...existingMetadata,
      documents: [...(existingMetadata.documents || []), ...documents],
      lastUpdated: new Date().toISOString()
    };

    const metadataResult = await ipfsService.uploadJSON(
      updatedMetadata, 
      `land-${land.surveyNumber}-metadata-updated.json`
    );

    // Pin the new metadata file
    await ipfsService.pinFile(metadataResult.hash);

    // Update document hash on blockchain
    const result = await blockchainService.updateDocument(landId, metadataResult.hash);

    res.json({
      message: 'Documents updated successfully',
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      gasUsed: result.gasUsed,
      newIpfsHash: metadataResult.hash,
      ipfsUrl: ipfsService.getPublicURL(metadataResult.hash),
      documentsAdded: documents.length
    });

  } catch (error) {
    console.error('Error updating documents:', error);
    
    if (error.message.includes('Land does not exist')) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    res.status(500).json({ error: 'Failed to update documents' });
  }
});

// @route   GET /api/lands/:id/documents
// @desc    Get land documents from IPFS
// @access  Public
router.get('/:id/documents', async (req, res) => {
  try {
    const landId = parseInt(req.params.id);
    
    if (isNaN(landId) || landId <= 0) {
      return res.status(400).json({ error: 'Invalid land ID' });
    }

    const land = await blockchainService.getLand(landId);
    
    if (!land.ipfsHash) {
      return res.status(404).json({ error: 'No documents found for this land' });
    }

    const metadata = await ipfsService.getJSON(land.ipfsHash);
    
    // Add public URLs for documents
    if (metadata.documents) {
      metadata.documents = metadata.documents.map(doc => ({
        ...doc,
        url: ipfsService.getPublicURL(doc.hash)
      }));
    }

    res.json({
      metadata,
      ipfsHash: land.ipfsHash,
      ipfsUrl: ipfsService.getPublicURL(land.ipfsHash)
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    
    if (error.message.includes('Land does not exist')) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

module.exports = router;
