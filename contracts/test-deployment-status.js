const fs = require('fs');
const path = require('path');

console.log("🔍 BhoomiChain Deployment Status Check");
console.log("=====================================");
console.log("");

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log("✅ .env file found");
    
    // Read and check .env content
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('PRIVATE_KEY=your_private_key_here')) {
        console.log("⚠️  PRIVATE_KEY not set in .env file");
        console.log("   You need to replace 'your_private_key_here' with your actual private key");
    } else if (envContent.includes('PRIVATE_KEY=')) {
        console.log("✅ PRIVATE_KEY is set in .env file");
    } else {
        console.log("❌ PRIVATE_KEY not found in .env file");
    }
    
    if (envContent.includes('POLYGON_MUMBAI_RPC_URL=')) {
        console.log("✅ POLYGON_MUMBAI_RPC_URL is set");
    } else {
        console.log("❌ POLYGON_MUMBAI_RPC_URL not found");
    }
    
} else {
    console.log("❌ .env file not found");
    console.log("   Run 'create-env.bat' to create it");
}

console.log("");

// Check contract addresses
const contractAddressesPath = path.join(__dirname, 'contractAddresses', 'contract-addresses.json');
if (fs.existsSync(contractAddressesPath)) {
    console.log("📋 Contract Addresses:");
    const addresses = JSON.parse(fs.readFileSync(contractAddressesPath, 'utf8'));
    console.log(`   Network: ${addresses.network}`);
    console.log(`   Contract: ${addresses.LandRegistry}`);
    console.log(`   Deployer: ${addresses.deployer}`);
    console.log(`   Deployed: ${addresses.deployedAt}`);
    
    if (addresses.network === 'localhost') {
        console.log("");
        console.log("⚠️  Contract is only deployed locally");
        console.log("   You need to deploy to a testnet (Mumbai or Sepolia)");
    }
} else {
    console.log("❌ Contract addresses file not found");
}

console.log("");
console.log("📋 Next Steps:");
console.log("1. Make sure .env file has your PRIVATE_KEY");
console.log("2. Ensure you have testnet tokens (MATIC for Mumbai, ETH for Sepolia)");
console.log("3. Add the correct testnet to MetaMask");
console.log("4. Run the deployment script again");
console.log("");
console.log("🎯 Recommended: Use Sepolia testnet (more reliable than Mumbai)");
console.log("   Network: Sepolia");
console.log("   RPC URL: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
console.log("   Chain ID: 11155111");
console.log("   Faucet: https://sepoliafaucet.com/");
