# BhoomiChain - Setup and Deployment Guide

## 🚀 Quick Start Guide

### Prerequisites

Before setting up BhoomiChain, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **MetaMask** browser extension - [Install](https://metamask.io/)
- **MongoDB** (for backend database) - [Install](https://www.mongodb.com/try/download/community)

### Optional (for full functionality):
- **Docker** (for IPFS node) - [Install](https://www.docker.com/)
- **Hardhat** (already included in dependencies)

## 📁 Project Overview

```
BhoomiChain/
├── contracts/          # Smart contracts (Solidity)
├── backend/            # Node.js API server
├── frontend/           # React.js application  
├── docs/               # Documentation
├── scripts/            # Deployment scripts
└── README.md
```

## 🔧 Installation Steps

### 1. Clone and Install Dependencies

```bash
# Clone the project (if from Git)
git clone https://github.com/your-username/BhoomiChain.git
cd BhoomiChain

# Install all dependencies
npm run install:all
```

### 2. Environment Configuration

#### Backend Environment (.env)
Create `backend/.env` from `backend/.env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database Configuration  
MONGODB_URI=mongodb://localhost:27017/bhoomichain

# Blockchain Configuration
RPC_URL=http://localhost:8545
PRIVATE_KEY=your_private_key_here

# IPFS Configuration
IPFS_URL=http://localhost:5001
IPFS_GATEWAY=https://ipfs.io/ipfs

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

### 3. Start Local Blockchain

```bash
# Terminal 1: Start Hardhat local network
cd contracts
npx hardhat node
```

### 4. Deploy Smart Contracts

```bash
# Terminal 2: Deploy contracts
cd contracts  
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Start Backend Services

```bash
# Terminal 3: Start MongoDB (if not using Docker)
mongod

# Start backend server
cd backend
npm run dev
```

### 6. Start Frontend Application

```bash
# Terminal 4: Start React app
cd frontend
npm start
```

## 🌐 Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **Blockchain Network**: http://localhost:8545

## 📱 Using the Application

### 1. Connect Wallet
- Click "Connect Wallet" in the navigation bar
- For demo: The app will simulate wallet connection
- For production: Connect your MetaMask wallet

### 2. Explore Features
- **Home**: Overview and quick actions
- **Search**: Find land records by various criteria
- **Map**: Interactive map visualization (placeholder)
- **Register**: Register new land properties (officials only)
- **Transfers**: Manage ownership transfers
- **Dashboard**: View statistics and analytics

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
npm test
```

### API Testing
```bash
# Test API endpoints
curl http://localhost:5000/api/health

# Test land search
curl http://localhost:5000/api/search/statistics
```

## 🚀 Production Deployment

### 1. Testnet Deployment

#### Configure Testnet Environment
```env
# Update backend/.env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_project_id
PRIVATE_KEY=your_testnet_private_key
```

#### Deploy to Sepolia
```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

### 2. Frontend Build
```bash
cd frontend
npm run build
```

### 3. Backend Production Setup
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

## 🐳 Docker Deployment (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  ipfs:
    image: ipfs/go-ipfs:latest
    ports:
      - "5001:5001"
      - "8080:8080"
    volumes:
      - ipfs_data:/data/ipfs

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
      - ipfs
    environment:
      - NODE_ENV=production

volumes:
  mongodb_data:
  ipfs_data:
```

Run with Docker:
```bash
docker-compose up -d
```

## 🛠️ API Endpoints

### Land Management
- `GET /api/lands` - Get all lands (paginated)
- `GET /api/lands/:id` - Get specific land details
- `POST /api/lands/register` - Register new land
- `POST /api/lands/:id/verify` - Verify land property

### Search & Discovery
- `GET /api/search` - Search lands with filters
- `GET /api/search/statistics` - Get system statistics
- `GET /api/lands/owner/:address` - Get lands by owner

### Transfers
- `POST /api/transfers/:landId/request` - Request transfer
- `POST /api/transfers/:landId/approve` - Approve transfer
- `POST /api/transfers/:landId/complete` - Complete transfer

### Documents (IPFS)
- `POST /api/documents/upload` - Upload documents
- `GET /api/documents/:hash` - Get document info
- `GET /api/documents/:hash/download` - Download document

## 🔒 Security Considerations

### Development
- Use test networks only
- Never commit private keys
- Use environment variables for secrets

### Production
- Implement proper authentication (JWT)
- Use HTTPS everywhere
- Regular security audits for smart contracts
- Rate limiting on APIs
- Input validation and sanitization

## 🏗️ Architecture

### Blockchain Layer
- **Smart Contracts**: Solidity contracts on Ethereum
- **IPFS**: Distributed storage for documents
- **Web3**: Blockchain interaction layer

### Backend Layer
- **Node.js + Express**: REST API server
- **MongoDB**: Off-chain data storage
- **Ethers.js**: Blockchain integration

### Frontend Layer
- **React + TypeScript**: User interface
- **Material-UI**: Component library
- **React Router**: Navigation
- **Mapbox GL JS**: Map visualization

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if ports are in use
   netstat -an | grep 3000
   netstat -an | grep 5000
   ```

2. **Contract Deployment Fails**
   - Ensure Hardhat network is running
   - Check account has sufficient ETH
   - Verify contract compilation

3. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Update dependencies

4. **Backend Connection Issues**
   - Verify MongoDB is running
   - Check environment variables
   - Ensure correct network configuration

## 📊 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Service worker for caching
- Bundle analysis with webpack-bundle-analyzer

### Backend
- Database indexing
- API response caching
- Connection pooling
- Load balancing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`  
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: Check `/docs` folder
- **Community**: Discord/Telegram (if available)

---

**⚠️ Disclaimer**: This is a hackathon demo project. For production use, additional security audits, legal compliance, and thorough testing would be required.
