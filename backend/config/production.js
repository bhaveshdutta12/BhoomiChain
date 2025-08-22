// Production Configuration
module.exports = {
  // Server Configuration
  port: process.env.PORT || 10000,
  nodeEnv: 'production',
  
  // Database Configuration
  mongoUri: process.env.MONGODB_URI || null,
  
  // Blockchain Configuration
  rpcUrl: process.env.RPC_URL || null,
  privateKey: process.env.PRIVATE_KEY || null,
  
  // IPFS Configuration
  ipfsGateway: process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs',
  
  // CORS Configuration
  frontendUrl: process.env.FRONTEND_URL || '*',
  
  // Security Configuration
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // 100 requests per window
  
  // File Upload Configuration
  maxFileSize: 50 * 1024 * 1024, // 50MB
  uploadPath: 'uploads'
};
