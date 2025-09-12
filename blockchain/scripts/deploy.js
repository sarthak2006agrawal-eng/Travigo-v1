const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const ItineraryStorage = await ethers.getContractFactory("ItineraryStorage");
  const itn = await ItineraryStorage.deploy();

  await itn.waitForDeployment();

  console.log("Contract deployed to:", await itn.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
