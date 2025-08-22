# 🚀 Smart Contract Deployment Guide

## 📋 Prerequisites

1. **MetaMask Wallet** installed and configured
2. **Mumbai Testnet** added to MetaMask
3. **Testnet MATIC** tokens (get from https://faucet.polygon.technology/)
4. **Private Key** from your wallet

## 🔧 Setup Steps

### 1. Add Mumbai Testnet to MetaMask

**Network Details:**
- **Network Name**: Mumbai Testnet
- **RPC URL**: https://rpc-mumbai.maticvigil.com
- **Chain ID**: 80001
- **Currency Symbol**: MATIC
- **Block Explorer**: https://mumbai.polygonscan.com

### 2. Get Testnet MATIC

1. Go to https://faucet.polygon.technology/
2. Connect your MetaMask wallet
3. Select Mumbai network
4. Request testnet MATIC
5. Wait for tokens to arrive

### 3. Create Environment File

Create a `.env` file in the contracts directory:

```bash
# Your wallet private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Mumbai testnet RPC URL
POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com

# Optional: Sepolia testnet
SEPOLIA_RPC_URL=your_sepolia_rpc_url
```

### 4. Deploy to Mumbai Testnet

```bash
# Install dependencies
npm install

# Deploy to Mumbai
npx hardhat run scripts/deploy.js --network mumbai
```

### 5. Update Contract Addresses

After deployment, update:
- `contractAddresses/contract-addresses.json`
- Frontend environment variables in Vercel

## 🎯 Deployment Commands

### **Mumbai Testnet (Recommended)**
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

### **Sepolia Testnet**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### **Local Development**
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

## 🔍 Verification

After deployment, verify your contract on:
- **Mumbai**: https://mumbai.polygonscan.com
- **Sepolia**: https://sepolia.etherscan.io

## ⚠️ Security Notes

- **Never share your private key**
- **Use testnet for development**
- **Keep mainnet private keys secure**
- **Test thoroughly before mainnet**

## 🆘 Troubleshooting

### **Insufficient Funds Error**
- Get more testnet tokens from faucet
- Check wallet balance

### **Network Connection Error**
- Verify RPC URL is correct
- Check internet connection
- Ensure MetaMask is on correct network

### **Compilation Error**
- Check Solidity version compatibility
- Verify all dependencies are installed
