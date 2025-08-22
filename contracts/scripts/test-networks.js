const { ethers } = require("hardhat");

async function main() {
  console.log("Testing network configuration...");
  
  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("Connected to network:", network.name);
  console.log("Chain ID:", network.chainId);
  
  // Test if we can get block number (basic connectivity test)
  try {
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("Latest block number:", blockNumber);
    
    // Test if we can get accounts
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    
    // Test if we can get balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Deployer balance:", ethers.formatEther(balance), "ETH");
    
    console.log("✅ Network configuration is working!");
  } catch (error) {
    console.log("❌ Network connection failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
