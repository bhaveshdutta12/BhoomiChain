# Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Make sure you're in the `frontend` directory

## Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

### 4. Set Environment Variables in Vercel Dashboard
Go to your project settings in Vercel and set these environment variables:

- `REACT_APP_API_URL`: Your Render backend URL (e.g., https://your-app.onrender.com)
- `REACT_APP_IPFS_API_URL`: Your backend IPFS endpoint (e.g., https://your-app.onrender.com/api/v0)
- `REACT_APP_IPFS_GATEWAY`: IPFS gateway (e.g., https://ipfs.io/ipfs)
- `REACT_APP_NETWORK_ID`: Your blockchain network ID (e.g., 80001 for Mumbai)
- `REACT_APP_CONTRACT_ADDRESS`: Your deployed smart contract address

### 5. Redeploy After Setting Environment Variables
```bash
vercel --prod
```

## Troubleshooting
- If you get build errors, check that all dependencies are installed
- Make sure the build command works locally first
- Check Vercel build logs for specific error messages
