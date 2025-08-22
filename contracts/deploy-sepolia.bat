@echo off
chcp 65001 >nul
echo 🚀 BhoomiChain Smart Contract Deployment to Sepolia Testnet
echo =============================================================
echo.

echo 📋 Prerequisites Check:
echo 1. MetaMask installed and configured
echo 2. Sepolia testnet added to MetaMask
echo 3. Testnet ETH tokens (get from https://sepoliafaucet.com/)
echo 4. Private key exported from MetaMask
echo.

echo ⚠️  IMPORTANT: Make sure you have:
echo    - Created a .env file with your PRIVATE_KEY
echo    - Added Sepolia testnet to MetaMask
echo    - Have testnet ETH tokens
echo.

pause

echo 🔧 Installing dependencies...
call npm install

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

echo 🚀 Deploying to Sepolia testnet...
echo Network: Sepolia (Ethereum)
echo Chain ID: 11155111
echo.

npx hardhat run scripts/deploy.js --network sepolia

if errorlevel 1 (
    echo ❌ Deployment failed
    echo.
    echo 🔍 Troubleshooting:
    echo 1. Check your .env file has PRIVATE_KEY
    echo 2. Ensure you have testnet ETH tokens
    echo 3. Verify MetaMask is on Sepolia network
    echo 4. Check internet connection
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment successful!
echo.
echo 📋 Next steps:
echo 1. Copy the contract address from above
echo 2. Update frontend environment variables in Vercel
echo 3. Test your application
echo.
echo 🔍 Verify on Sepolia Etherscan:
echo https://sepolia.etherscan.io
echo.

pause
