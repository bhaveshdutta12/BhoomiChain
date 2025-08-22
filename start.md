# 🚀 BhoomiChain Quick Start Guide

## ✅ Installation Complete!

All dependencies have been successfully installed. Here's how to get BhoomiChain running:

## 🔥 Start the Application (4 Terminals)

### Terminal 1: Start Hardhat Network
```bash
cd contracts
npx hardhat node
```
Keep this running - it will show transaction logs.

### Terminal 2: Deploy Smart Contracts
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```
This will deploy the LandRegistry contract to your local network.

### Terminal 3: Start Backend API
```bash
cd backend
# Copy environment file first
copy .env.example .env
# Start the server
npm run dev
```
The API will be available at http://localhost:5000

### Terminal 4: Start Frontend
```bash
cd frontend
npm start
```
The React app will open at http://localhost:3000

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health
- **Blockchain**: http://localhost:8545

## 🎮 Features to Try

1. **Home Page**: Overview of the system
2. **Connect Wallet**: Demo wallet connection
3. **Search**: Look for land records
4. **Map View**: Interactive land visualization
5. **Register Land**: Add new properties (officials only)
6. **Transfers**: Manage ownership changes

## 🔧 Quick Testing

```bash
# Test API health
curl http://localhost:5000/api/health

# Test smart contract compilation
cd contracts
npx hardhat test

# Check frontend build
cd frontend
npm run build
```

## 🗂️ What's Included

✅ **Smart Contracts**: Land registry with ownership transfers  
✅ **Backend API**: Full REST API with 20+ endpoints  
✅ **Frontend**: React app with Material-UI  
✅ **IPFS Integration**: Document storage system  
✅ **Map Support**: Ready for Mapbox integration  
✅ **Testing**: Comprehensive test suites  

## 🚧 Current Status

- **Smart Contracts**: ✅ Fully functional
- **Backend API**: ✅ Complete with mock IPFS
- **Frontend**: ✅ Home page + navigation ready
- **Database**: ⏳ MongoDB setup needed
- **IPFS Node**: ⏳ Optional for full functionality

## 📝 Next Steps

1. **Set up MongoDB** (optional): For backend data storage
2. **Set up IPFS Node** (optional): For document storage
3. **Add Mapbox API Key**: For map functionality
4. **Complete Frontend Pages**: Add forms and detailed views
5. **Deploy to Testnet**: Use Sepolia or other testnet

## 🎯 Hackathon Ready!

Your BhoomiChain project is ready for demonstration with:
- Working smart contracts ✅
- REST API endpoints ✅  
- Beautiful UI framework ✅
- Comprehensive documentation ✅

Happy hacking! 🏆
