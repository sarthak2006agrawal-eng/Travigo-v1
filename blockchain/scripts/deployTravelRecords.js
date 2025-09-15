const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying TravelRecords contract with account:", deployer.address);

  const TravelRecords = await hre.ethers.getContractFactory("TravelRecords");
  const travelRecords = await TravelRecords.deploy();


  await travelRecords.waitForDeployment();

  console.log("TravelRecords deployed to:", await travelRecords.getAddress());

  // Save to .env
  console.log("\nAdd this to your .env file:");
  console.log(`TRAVEL_RECORDS_ADDRESS=${await travelRecords.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
