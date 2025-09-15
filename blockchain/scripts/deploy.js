const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy ItineraryRegistry
  const ItineraryRegistry = await hre.ethers.getContractFactory("ItineraryRegistry");
  const itineraryRegistry = await ItineraryRegistry.deploy();
  await itineraryRegistry.waitForDeployment();
  console.log("ItineraryRegistry deployed to:", await itineraryRegistry.getAddress());

  // Deploy ItineraryStorage
  const ItineraryStorage = await hre.ethers.getContractFactory("ItineraryStorage");
  const itineraryStorage = await ItineraryStorage.deploy();
  await itineraryStorage.waitForDeployment();
  console.log("ItineraryStorage deployed to:", await itineraryStorage.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
