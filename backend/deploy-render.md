# Render Deployment Guide

## Prerequisites
1. Create a Render account at https://render.com
2. Connect your GitHub repository
3. Make sure your backend code is pushed to GitHub

## Deployment Steps

### 1. Create New Web Service
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository branch (main/master)

### 2. Configure the Service
- **Name**: `bhoomichain-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or choose paid if needed)

### 3. Set Environment Variables
Add these environment variables in Render:

- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will override this)
- `MONGODB_URI`: Your MongoDB connection string (optional)
- `RPC_URL`: Your blockchain RPC endpoint (optional)
- `PRIVATE_KEY`: Your wallet private key (optional)
- `IPFS_GATEWAY`: `https://ipfs.io/ipfs`
- `FRONTEND_URL`: Your Vercel frontend URL

### 4. Deploy
Click "Create Web Service" and wait for deployment.

### 5. Get Your Backend URL
After successful deployment, you'll get a URL like:
`https://your-app-name.onrender.com`

### 6. Update Frontend Environment Variables
Go back to Vercel and update:
- `REACT_APP_API_URL`: Your Render backend URL
- `REACT_APP_IPFS_API_URL`: Your Render backend URL + `/api/v0`

## Troubleshooting
- Check Render build logs for errors
- Make sure all dependencies are in package.json
- Verify environment variables are set correctly
- Check that the start command works locally
