@echo off
chcp 65001 >nul
echo 🚀 BhoomiChain Deployment Script
echo ==================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the root directory
    pause
    exit /b 1
)

REM Check prerequisites
echo 🔍 Checking prerequisites...

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

echo ✅ All prerequisites are met!

:menu
echo.
echo Choose an option:
echo 1) Install all dependencies
echo 2) Deploy frontend to Vercel
echo 3) Show backend deployment instructions
echo 4) Deploy both (frontend + instructions)
echo 5) Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto install_all
if "%choice%"=="2" goto deploy_frontend
if "%choice%"=="3" goto deploy_backend
if "%choice%"=="4" goto deploy_both
if "%choice%"=="5" goto exit
echo ❌ Invalid choice. Please try again.
goto menu

:install_all
echo 📦 Installing all dependencies...
call npm run install:all
goto menu

:deploy_frontend
echo 📱 Deploying Frontend to Vercel...
cd frontend

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    call npm install -g vercel
)

REM Install dependencies
echo 📦 Installing frontend dependencies...
call npm install

REM Build the project
echo 🔨 Building frontend...
call npm run build

if errorlevel 1 (
    echo ❌ Frontend build failed!
    cd ..
    pause
    goto menu
)

echo ✅ Frontend build successful!
echo 🚀 Deploying to Vercel...
vercel --prod

cd ..
goto menu

:deploy_backend
echo 🔧 Backend Deployment Instructions for Render:
echo ==============================================
echo 1. Go to https://render.com
echo 2. Create a new Web Service
echo 3. Connect your GitHub repository
echo 4. Use these settings:
echo    - Name: bhoomichain-backend
echo    - Environment: Node
echo    - Build Command: npm install
echo    - Start Command: npm start
echo 5. Set environment variables (see backend/deploy-render.md)
echo.
echo 📖 Detailed instructions: backend/deploy-render.md
pause
goto menu

:deploy_both
call :install_all
call :deploy_frontend
call :deploy_backend
goto menu

:exit
echo 👋 Goodbye!
pause
exit /b 0
