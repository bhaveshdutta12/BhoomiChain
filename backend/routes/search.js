const express = require('express');
const router = express.Router();
const blockchainService = require('../utils/blockchain');

// @route   GET /api/search
// @desc    Search lands by various criteria
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      surveyNumber, 
      owner, 
      location, 
      verified,
      status,
      page = 1, 
      limit = 10 
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // If searching by survey number, return specific land
    if (surveyNumber) {
      try {
        const landId = await blockchainService.getLandIdBySurveyNumber(surveyNumber);
        if (landId === 0) {
          return res.json({ lands: [], total: 0, message: 'No land found with this survey number' });
        }
        
        const land = await blockchainService.getLand(landId);
        return res.json({ 
          lands: [land], 
          total: 1,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        });
      } catch (error) {
        return res.json({ lands: [], total: 0, message: 'No land found with this survey number' });
      }
    }

    // If searching by owner, return owner's lands
    if (owner) {
      // Validate Ethereum address
      if (!/^0x[a-fA-F0-9]{40}$/.test(owner)) {
        return res.status(400).json({ error: 'Invalid Ethereum address' });
      }

      try {
        const landIds = await blockchainService.getLandsByOwner(owner);
        const lands = [];
        
        for (const landId of landIds) {
          try {
            const land = await blockchainService.getLand(landId);
            lands.push(land);
          } catch (error) {
            console.error(`Error fetching land ${landId}:`, error);
          }
        }

        // Apply pagination
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const paginatedLands = lands.slice(startIndex, endIndex);

        return res.json({
          lands: paginatedLands,
          total: lands.length,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(lands.length / limitNum),
            hasNext: endIndex < lands.length,
            hasPrev: pageNum > 1
          }
        });
      } catch (error) {
        return res.json({ lands: [], total: 0, message: 'No lands found for this owner' });
      }
    }

    // General search across all lands
    const totalLands = await blockchainService.getTotalLands();
    const allLands = [];

    // Fetch all lands (for demo purposes - in production, this should be optimized)
    for (let i = 1; i <= totalLands; i++) {
      try {
        const land = await blockchainService.getLand(i);
        allLands.push(land);
      } catch (error) {
        console.error(`Error fetching land ${i}:`, error);
      }
    }

    // Apply filters
    let filteredLands = allLands;

    if (location) {
      filteredLands = filteredLands.filter(land => 
        land.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (verified !== undefined) {
      const isVerified = verified === 'true';
      filteredLands = filteredLands.filter(land => land.isVerified === isVerified);
    }

    if (status !== undefined) {
      const statusNum = parseInt(status);
      if (!isNaN(statusNum) && statusNum >= 0 && statusNum <= 3) {
        filteredLands = filteredLands.filter(land => land.status === statusNum);
      }
    }

    // Apply pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedLands = filteredLands.slice(startIndex, endIndex);

    res.json({
      lands: paginatedLands,
      total: filteredLands.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredLands.length / limitNum),
        hasNext: endIndex < filteredLands.length,
        hasPrev: pageNum > 1
      },
      filters: {
        location: location || null,
        verified: verified || null,
        status: status || null
      }
    });

  } catch (error) {
    console.error('Error searching lands:', error);
    res.status(500).json({ error: 'Failed to search lands' });
  }
});

// @route   GET /api/search/statistics
// @desc    Get land registry statistics
// @access  Public
router.get('/statistics', async (req, res) => {
  try {
    const totalLands = await blockchainService.getTotalLands();
    
    // Fetch all lands to calculate statistics
    const lands = [];
    for (let i = 1; i <= totalLands; i++) {
      try {
        const land = await blockchainService.getLand(i);
        lands.push(land);
      } catch (error) {
        console.error(`Error fetching land ${i}:`, error);
      }
    }

    // Calculate statistics
    const verifiedLands = lands.filter(land => land.isVerified).length;
    const unverifiedLands = totalLands - verifiedLands;
    
    const statusCounts = {
      registered: lands.filter(land => land.status === 0).length,
      transferPending: lands.filter(land => land.status === 1).length,
      disputed: lands.filter(land => land.status === 2).length,
      verified: lands.filter(land => land.status === 3).length
    };

    const totalArea = lands.reduce((sum, land) => sum + land.area, 0);
    const averageArea = totalLands > 0 ? totalArea / totalLands : 0;

    // Count unique owners
    const uniqueOwners = new Set(lands.map(land => land.currentOwner)).size;

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRegistrations = lands.filter(land => 
      new Date(land.registrationDate) > thirtyDaysAgo
    ).length;

    res.json({
      total: {
        lands: totalLands,
        verifiedLands,
        unverifiedLands,
        uniqueOwners,
        totalArea: Math.round(totalArea),
        averageArea: Math.round(averageArea)
      },
      status: statusCounts,
      recent: {
        registrations: recentRegistrations
      },
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// @route   GET /api/search/locations
// @desc    Get unique locations for filtering
// @access  Public
router.get('/locations', async (req, res) => {
  try {
    const totalLands = await blockchainService.getTotalLands();
    const locations = new Set();

    // Fetch all lands to get unique locations
    for (let i = 1; i <= totalLands; i++) {
      try {
        const land = await blockchainService.getLand(i);
        locations.add(land.location);
      } catch (error) {
        console.error(`Error fetching land ${i}:`, error);
      }
    }

    res.json({
      locations: Array.from(locations).sort(),
      count: locations.size
    });

  } catch (error) {
    console.error('Error getting locations:', error);
    res.status(500).json({ error: 'Failed to get locations' });
  }
});

module.exports = router;
