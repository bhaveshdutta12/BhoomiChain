const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

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
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, PDFs, and documents
    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and document files are allowed!'), false);
    }
  }
});

// @route   POST /api/documents/upload
// @desc    Upload documents to IPFS
// @access  Private
router.post('/upload', upload.array('documents', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedDocuments = [];

    for (const file of req.files) {
      try {
        // Upload to IPFS
        const ipfsResult = await ipfsService.uploadFile(file.path, file.originalname);
        
        // Pin the file
        await ipfsService.pinFile(ipfsResult.hash);

        uploadedDocuments.push({
          originalName: file.originalname,
          size: file.size,
          type: file.mimetype,
          ipfsHash: ipfsResult.hash,
          ipfsUrl: ipfsService.getPublicURL(ipfsResult.hash),
          uploadedAt: new Date().toISOString()
        });

        // Clean up temporary file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (error) {
        console.error(`Error uploading file ${file.originalname}:`, error);
      }
    }

    if (uploadedDocuments.length === 0) {
      return res.status(500).json({ error: 'Failed to upload any documents' });
    }

    res.status(201).json({
      message: 'Documents uploaded successfully',
      documents: uploadedDocuments,
      count: uploadedDocuments.length
    });

  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({ error: 'Failed to upload documents' });
  }
});

// @route   GET /api/documents/:hash
// @desc    Get document metadata by IPFS hash
// @access  Public
router.get('/:hash', async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash || !hash.startsWith('Qm')) {
      return res.status(400).json({ error: 'Invalid IPFS hash' });
    }

    // Try to get document from IPFS
    const document = await ipfsService.getFile(hash);
    
    res.json({
      hash,
      size: document.length,
      url: ipfsService.getPublicURL(hash),
      retrievedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching document:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// @route   GET /api/documents/:hash/download
// @desc    Download document from IPFS
// @access  Public
router.get('/:hash/download', async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash || !hash.startsWith('Qm')) {
      return res.status(400).json({ error: 'Invalid IPFS hash' });
    }

    // Get document from IPFS
    const document = await ipfsService.getFile(hash);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${hash}"`);
    res.setHeader('Content-Length', document.length);
    
    res.send(document);

  } catch (error) {
    console.error('Error downloading document:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.status(500).json({ error: 'Failed to download document' });
  }
});

// @route   POST /api/documents/:hash/pin
// @desc    Pin document to IPFS (prevent garbage collection)
// @access  Private (Government officials only)
router.post('/:hash/pin', async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash || !hash.startsWith('Qm')) {
      return res.status(400).json({ error: 'Invalid IPFS hash' });
    }

    const result = await ipfsService.pinFile(hash);
    
    if (result) {
      res.json({
        message: 'Document pinned successfully',
        hash,
        pinnedAt: new Date().toISOString()
      });
    } else {
      res.status(500).json({ error: 'Failed to pin document' });
    }

  } catch (error) {
    console.error('Error pinning document:', error);
    res.status(500).json({ error: 'Failed to pin document' });
  }
});

// @route   DELETE /api/documents/:hash/pin
// @desc    Unpin document from IPFS
// @access  Private (Government officials only)
router.delete('/:hash/pin', async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash || !hash.startsWith('Qm')) {
      return res.status(400).json({ error: 'Invalid IPFS hash' });
    }

    const result = await ipfsService.unpinFile(hash);
    
    if (result) {
      res.json({
        message: 'Document unpinned successfully',
        hash,
        unpinnedAt: new Date().toISOString()
      });
    } else {
      res.status(500).json({ error: 'Failed to unpin document' });
    }

  } catch (error) {
    console.error('Error unpinning document:', error);
    res.status(500).json({ error: 'Failed to unpin document' });
  }
});

// @route   POST /api/documents/metadata
// @desc    Upload JSON metadata to IPFS
// @access  Private
router.post('/metadata', async (req, res) => {
  try {
    const { data, filename } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Metadata required' });
    }

    const metadataFilename = filename || `metadata-${Date.now()}.json`;
    
    const result = await ipfsService.uploadJSON(data, metadataFilename);
    
    // Pin the metadata
    await ipfsService.pinFile(result.hash);

    res.status(201).json({
      message: 'Metadata uploaded successfully',
      hash: result.hash,
      url: ipfsService.getPublicURL(result.hash),
      filename: metadataFilename,
      size: result.size,
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error uploading metadata:', error);
    res.status(500).json({ error: 'Failed to upload metadata' });
  }
});

// @route   GET /api/documents/:hash/metadata
// @desc    Get JSON metadata from IPFS
// @access  Public
router.get('/:hash/metadata', async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash || !hash.startsWith('Qm')) {
      return res.status(400).json({ error: 'Invalid IPFS hash' });
    }

    const metadata = await ipfsService.getJSON(hash);
    
    res.json({
      hash,
      metadata,
      url: ipfsService.getPublicURL(hash),
      retrievedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching metadata:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Metadata not found' });
    }
    
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

// Error handling middleware for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 10 files' });
    }
  }
  
  if (err.message.includes('Only')) {
    return res.status(400).json({ error: err.message });
  }
  
  next(err);
});

module.exports = router;
