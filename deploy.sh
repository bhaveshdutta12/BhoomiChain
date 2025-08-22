#!/bin/bash

echo "🚀 BhoomiChain Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the root directory"
    exit 1
fi

# Function to deploy frontend to Vercel
deploy_frontend() {
    echo "📱 Deploying Frontend to Vercel..."
    cd frontend
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Install dependencies
    echo "📦 Installing frontend dependencies..."
    npm install
    
    # Build the project
    echo "🔨 Building frontend..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Frontend build successful!"
        echo "🚀 Deploying to Vercel..."
        vercel --prod
    else
        echo "❌ Frontend build failed!"
        exit 1
    fi
    
    cd ..
}

# Function to deploy backend to Render
deploy_backend() {
    echo "🔧 Backend Deployment Instructions for Render:"
    echo "=============================================="
    echo "1. Go to https://render.com"
    echo "2. Create a new Web Service"
    echo "3. Connect your GitHub repository"
    echo "4. Use these settings:"
    echo "   - Name: bhoomichain-backend"
    echo "   - Environment: Node"
    echo "   - Build Command: npm install"
    echo "   - Start Command: npm start"
    echo "5. Set environment variables (see backend/deploy-render.md)"
    echo ""
    echo "📖 Detailed instructions: backend/deploy-render.md"
}

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        echo "❌ Git is not installed. Please install Git first."
        exit 1
    fi
    
    echo "✅ All prerequisites are met!"
}

# Function to install all dependencies
install_all() {
    echo "📦 Installing all dependencies..."
    npm run install:all
}

# Main menu
main_menu() {
    echo ""
    echo "Choose an option:"
    echo "1) Install all dependencies"
    echo "2) Deploy frontend to Vercel"
    echo "3) Show backend deployment instructions"
    echo "4) Deploy both (frontend + instructions)"
    echo "5) Exit"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            install_all
            ;;
        2)
            deploy_frontend
            ;;
        3)
            deploy_backend
            ;;
        4)
            install_all
            deploy_frontend
            deploy_backend
            ;;
        5)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please try again."
            main_menu
            ;;
    esac
}

# Check prerequisites first
check_prerequisites

# Show main menu
main_menu
