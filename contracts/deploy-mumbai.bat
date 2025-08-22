@echo off
chcp 65001 >nul
echo 🚀 BhoomiChain Smart Contract Deployment to Mumbai Testnet
echo =============================================================
echo.

echo 📋 Prerequisites Check:
echo 1. MetaMask installed and configured
echo 2. Mumbai testnet added to MetaMask
echo 3. Testnet MATIC tokens (get from https://faucet.polygon.technology/)
echo 4. Private key exported from MetaMask
echo.

echo ⚠️  IMPORTANT: Make sure you have:
echo    - Created a .env file with your PRIVATE_KEY
echo    - Added Mumbai testnet to MetaMask
echo    - Have testnet MATIC tokens
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

echo 🚀 Deploying to Mumbai testnet...
echo Network: Mumbai (Polygon)
echo Chain ID: 80001
echo.

npx hardhat run scripts/deploy.js --network mumbai

if errorlevel 1 (
    echo ❌ Deployment failed
    echo.
    echo 🔍 Troubleshooting:
    echo 1. Check your .env file has PRIVATE_KEY
    echo 2. Ensure you have testnet MATIC tokens
    echo 3. Verify MetaMask is on Mumbai network
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
echo 🔍 Verify on Mumbai Polygonscan:
echo https://mumbai.polygonscan.com
echo.

pause
