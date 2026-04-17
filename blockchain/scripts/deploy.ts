import { network } from "hardhat";

async function main() {
  console.log("Connecting to network...");
  
  // In Hardhat 3, we must explicitly connect to get the ethers object
  const { ethers } = await network.connect();

  console.log("Starting deployment...");

  // Get the contract factory
  const ShipmentTracker = await ethers.getContractFactory("ShipmentTracker");
  
  // Deploy the contract
  const shipmentTracker = await ShipmentTracker.deploy();

  // Wait for the deployment to finish
  await shipmentTracker.waitForDeployment();

  const address = await shipmentTracker.getAddress();
  
  console.log("----------------------------------------------");
  console.log(`ShipmentTracker deployed to: ${address}`);
  console.log("----------------------------------------------");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});