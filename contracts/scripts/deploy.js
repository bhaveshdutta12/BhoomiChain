const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const deployerAddress = await deployer.getAddress();
  console.log("Deploying contracts with the account:", deployerAddress);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployerAddress)));

  // Deploy LandRegistry contract
  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy();

  await landRegistry.waitForDeployment();

  console.log("LandRegistry deployed to:", await landRegistry.getAddress());

  // Add some initial authorized officials (for demo purposes)
  console.log("Adding initial authorized officials...");
  
  // The deployer is already the owner, so they can add officials
  // In a real scenario, these would be real government official addresses
  const demoOfficial1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const demoOfficial2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
  
  await landRegistry.addAuthorizedOfficial(demoOfficial1);
  await landRegistry.addAuthorizedOfficial(demoOfficial2);
  
  console.log("Added authorized officials:");
  console.log("- Official 1:", demoOfficial1);
  console.log("- Official 2:", demoOfficial2);

  // Verify the deployment
  const totalLands = await landRegistry.getTotalLands();
  console.log("Total lands registered:", totalLands.toString());

  // Save deployment info
  const fs = require('fs');
  const contractsDir = __dirname + "/../contractAddresses";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const contractAddress = await landRegistry.getAddress();
  
  fs.writeFileSync(
    contractsDir + "/contract-addresses.json",
    JSON.stringify({
      LandRegistry: contractAddress,
      network: hre.network.name,
      deployer: deployerAddress,
      deployedAt: new Date().toISOString()
    }, undefined, 2)
  );

  console.log("Contract addresses saved to contractAddresses/contract-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
