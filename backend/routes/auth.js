const express = require('express');
const router = express.Router();

// Note: This is a simplified auth system for the hackathon demo
// In production, you would implement proper JWT authentication,
// user registration, role-based access control, etc.

// @route   POST /api/auth/login
// @desc    Simple login (demo purposes)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { address, role } = req.body;

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Valid Ethereum address required' });
    }

    if (!role || !['citizen', 'official', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Valid role required (citizen, official, admin)' });
    }

    // In a real app, you would verify the address signature and check user roles
    const user = {
      address,
      role,
      loginTime: new Date().toISOString()
    };

    res.json({
      message: 'Login successful',
      user,
      // In production, return a proper JWT token
      token: 'demo-jwt-token-' + Date.now()
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    // In production, extract user from JWT token
    const user = {
      address: '0x1234567890123456789012345678901234567890',
      role: 'citizen',
      joinDate: '2023-01-01T00:00:00.000Z'
    };

    res.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;
