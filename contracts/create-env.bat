@echo off
chcp 65001 >nul
echo 🔧 Creating Environment File for Smart Contract Deployment
echo =========================================================
echo.

echo 📝 This script will help you create a .env file
echo.

echo ⚠️  IMPORTANT: You need your MetaMask private key
echo   1. Open MetaMask
echo   2. Click your account → Account Details
echo   3. Click "Export Private Key"
echo   4. Enter your password
echo   5. Copy the private key (without 0x)
echo.

pause

echo 📁 Creating .env file...
echo.

if exist .env (
    echo ⚠️  .env file already exists
    echo    Do you want to overwrite it? (y/n)
    set /p choice=
    if /i "%choice%"=="y" (
        del .env
    ) else (
        echo Keeping existing .env file
        goto :end
    )
)

echo # Smart Contract Deployment Environment Variables > .env
echo # Copy this content to a .env file and fill in your values >> .env
echo. >> .env
echo # Your wallet private key (without 0x prefix) >> .env
echo # WARNING: Never share this or commit it to git! >> .env
echo PRIVATE_KEY=your_private_key_here >> .env
echo. >> .env
echo # Mumbai Testnet (Polygon) - Recommended for demos >> .env
echo POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com >> .env
echo. >> .env
echo # Sepolia Testnet (Ethereum) - Alternative option >> .env
echo SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161 >> .env

echo ✅ .env file created successfully!
echo.
echo 📋 Next steps:
echo 1. Open the .env file in a text editor
echo 2. Replace 'your_private_key_here' with your actual private key
echo 3. Save the file
echo 4. Run the deployment script again
echo.

:end
pause
