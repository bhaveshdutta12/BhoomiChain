const { ethers } = require("hardhat");

async function testNetwork() {
  console.log("🧪 Testing Mumbai Network Connection...\n");
  
  try {
    // Test Mumbai network connection
    const provider = new ethers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
    
    console.log("📡 Connecting to Mumbai testnet...");
    const network = await provider.getNetwork();
    console.log(`✅ Connected! Chain ID: ${network.chainId}`);
    
    // Get latest block
    const latestBlock = await provider.getBlockNumber();
    console.log(`📦 Latest Block: ${latestBlock}`);
    
    // Get gas price
    const gasPrice = await provider.getFeeData();
    console.log(`⛽ Gas Price: ${ethers.formatUnits(gasPrice.gasPrice, "gwei")} gwei`);
    
    console.log("\n🎉 Network connection successful!");
    console.log("You can now deploy your smart contracts!");
    
  } catch (error) {
    console.error("❌ Network connection failed:", error.message);
    console.log("\n🔍 Troubleshooting:");
    console.log("1. Check your internet connection");
    console.log("2. Verify the RPC URL is correct");
    console.log("3. Try alternative RPC URLs");
  }
}

testNetwork()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
