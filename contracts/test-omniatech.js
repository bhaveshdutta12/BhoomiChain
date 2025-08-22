const { ethers } = require("hardhat");

async function testOmniatechRpc() {
  console.log("🧪 Testing Omniatech Mumbai RPC URL...\n");
  
  const rpcUrl = "https://endpoints.omniatech.io/v1/matic/mumbai/public";
  
  try {
    console.log(`📡 Connecting to: ${rpcUrl}`);
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    const network = await provider.getNetwork();
    console.log(`✅ Connected! Chain ID: ${network.chainId}`);
    
    const latestBlock = await provider.getBlockNumber();
    console.log(`📦 Latest Block: ${latestBlock}`);
    
    const gasPrice = await provider.getFeeData();
    console.log(`⛽ Gas Price: ${ethers.formatUnits(gasPrice.gasPrice, "gwei")} gwei`);
    
    console.log("\n🎉 Network connection successful!");
    console.log("This RPC URL works! Use it in MetaMask:");
    console.log(`   ${rpcUrl}`);
    
  } catch (error) {
    console.error("❌ Network connection failed:", error.message);
    console.log("\n🔍 Troubleshooting:");
    console.log("1. Check your internet connection");
    console.log("2. Try adding https:// to the RPC URL");
    console.log("3. Verify the URL is correct");
  }
}

testOmniatechRpc()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
