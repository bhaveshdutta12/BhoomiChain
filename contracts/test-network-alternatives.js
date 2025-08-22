const { ethers } = require("hardhat");

const rpcUrls = [
  "https://rpc-mumbai.maticvigil.com",
  "https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  "https://endpoints.omniatech.io/v1/matic/mumbai/public",
  "https://matic-mumbai.chainstacklabs.com",
  "https://rpc.ankr.com/polygon_mumbai",
  "https://polygon-testnet.public.blastapi.io"
];

async function testRpcUrl(url) {
  try {
    console.log(`🔍 Testing: ${url}`);
    const provider = new ethers.JsonRpcProvider(url);
    
    const network = await provider.getNetwork();
    const latestBlock = await provider.getBlockNumber();
    
    console.log(`✅ SUCCESS! Chain ID: ${network.chainId}, Latest Block: ${latestBlock}`);
    return { url, success: true, chainId: network.chainId };
    
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return { url, success: false, error: error.message };
  }
}

async function testAllRpcUrls() {
  console.log("🧪 Testing Multiple Mumbai RPC URLs...\n");
  
  const results = [];
  
  for (const url of rpcUrls) {
    const result = await testRpcUrl(url);
    results.push(result);
    console.log(""); // Empty line for readability
  }
  
  console.log("📊 Results Summary:");
  console.log("===================");
  
  const workingUrls = results.filter(r => r.success);
  
  if (workingUrls.length > 0) {
    console.log(`✅ ${workingUrls.length} working RPC URL(s) found:`);
    workingUrls.forEach(r => {
      console.log(`   - ${r.url} (Chain ID: ${r.chainId})`);
    });
    
    console.log("\n🎯 Recommended RPC URL for MetaMask:");
    console.log(`   ${workingUrls[0].url}`);
    
  } else {
    console.log("❌ No working RPC URLs found");
    console.log("🔍 Check your internet connection and try again");
  }
  
  console.log("\n📋 All tested URLs:");
  results.forEach(r => {
    const status = r.success ? "✅" : "❌";
    console.log(`   ${status} ${r.url}`);
  });
}

testAllRpcUrls()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
