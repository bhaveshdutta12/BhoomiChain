# 🚀 BhoomiChain Deployment Guide

This guide will help you deploy your BhoomiChain application on both Vercel (frontend) and Render (backend).

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- GitHub account
- Vercel account
- Render account

## 🏗️ Project Structure

```
BhoomiChain/
├── frontend/          # React frontend (deploy to Vercel)
├── backend/           # Node.js backend (deploy to Render)
├── contracts/         # Smart contracts (deploy separately)
├── deploy.bat         # Windows deployment script
├── deploy.sh          # Linux/Mac deployment script
└── DEPLOYMENT.md      # This file
```

## 🚀 Quick Start

### Option 1: Use the Deployment Script (Recommended)

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deployment

## 📱 Frontend Deployment (Vercel)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Navigate to Frontend Directory
```bash
cd frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Build the Project
```bash
npm run build
```

### 5. Deploy to Vercel
```bash
vercel --prod
```

### 6. Set Environment Variables in Vercel Dashboard
After deployment, go to your Vercel project settings and add:

- `REACT_APP_API_URL`: Your Render backend URL
- `REACT_APP_IPFS_API_URL`: Your backend IPFS endpoint
- `REACT_APP_IPFS_GATEWAY`: `https://ipfs.io/ipfs`
- `REACT_APP_NETWORK_ID`: Your blockchain network ID
- `REACT_APP_CONTRACT_ADDRESS`: Your smart contract address

## 🔧 Backend Deployment (Render)

### 1. Create Render Account
Go to [render.com](https://render.com) and create an account.

### 2. Connect GitHub Repository
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the branch (main/master)

### 3. Configure the Service
- **Name**: `bhoomichain-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or choose paid if needed)

### 4. Set Environment Variables
Add these in Render:

- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will override)
- `MONGODB_URI`: Your MongoDB connection string (optional)
- `RPC_URL`: Your blockchain RPC endpoint (optional)
- `PRIVATE_KEY`: Your wallet private key (optional)
- `IPFS_GATEWAY`: `https://ipfs.io/ipfs`
- `FRONTEND_URL`: Your Vercel frontend URL

### 5. Deploy
Click "Create Web Service" and wait for deployment.

## 🔗 Connect Frontend and Backend

### 1. Get Your Backend URL
After Render deployment, you'll get a URL like:
`https://your-app-name.onrender.com`

### 2. Update Frontend Environment Variables
In Vercel dashboard, update:
- `REACT_APP_API_URL`: Your Render backend URL
- `REACT_APP_IPFS_API_URL`: Your Render backend URL + `/api/v0`

### 3. Redeploy Frontend
```bash
cd frontend
vercel --prod
```

## 🧪 Testing Your Deployment

### 1. Test Backend Health
Visit: `https://your-backend.onrender.com/api/health`

### 2. Test Frontend
Visit your Vercel URL and check the console for any errors.

### 3. Test API Calls
Make sure your frontend can communicate with your backend.

## 🚨 Common Issues and Solutions

### Frontend Build Errors
- **Issue**: Build fails on Vercel
- **Solution**: Check that all dependencies are in package.json and build works locally

### Backend Deployment Errors
- **Issue**: Render deployment fails
- **Solution**: Check build logs, ensure start command works locally

### CORS Errors
- **Issue**: Frontend can't connect to backend
- **Solution**: Update `FRONTEND_URL` in Render environment variables

### Environment Variable Issues
- **Issue**: App doesn't work in production
- **Solution**: Verify all environment variables are set in both platforms

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Frontend Deployment Guide](frontend/deploy-vercel.md)
- [Backend Deployment Guide](backend/deploy-render.md)

## 🆘 Getting Help

If you encounter issues:

1. Check the deployment logs in both platforms
2. Verify environment variables are set correctly
3. Test locally first
4. Check the troubleshooting sections in individual guides

## 🎉 Success!

Once deployed, your BhoomiChain application will be accessible at:
- **Frontend**: Your Vercel URL
- **Backend**: Your Render URL
- **API**: Your Render URL + `/api/*`

Happy deploying! 🚀
