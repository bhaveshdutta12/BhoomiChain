// Environment Configuration
export const config = {
  // API Configuration
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  ipfsApiUrl: process.env.REACT_APP_IPFS_API_URL || 'http://localhost:5001/api/v0',
  ipfsGateway: process.env.REACT_APP_IPFS_GATEWAY || 'https://ipfs.io/ipfs',
  
  // Blockchain Configuration
  networkId: process.env.REACT_APP_NETWORK_ID || '80001',
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || '0x1234567890abcdef1234567890abcdef12345678',
  
  // Environment
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development'
};

// Default values for development
export const defaultConfig = {
  apiUrl: 'http://localhost:5001',
  ipfsApiUrl: 'http://localhost:5001/api/v0',
  ipfsGateway: 'https://ipfs.io/ipfs',
  networkId: '80001',
  contractAddress: '0x1234567890abcdef1234567890abcdef12345678'
};
