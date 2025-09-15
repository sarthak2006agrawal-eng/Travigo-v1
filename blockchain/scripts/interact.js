const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const provider = new hre.ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const storageAbi = [
    "function addItinerary(string memory userId, string memory itineraryJson) public",
    "function getItinerary(uint256 index) public view returns (string memory, string memory)"
  ];

  const storage = new hre.ethers.Contract(process.env.ITINERARY_STORAGE_ADDRESS, storageAbi, wallet);

  // sample itinerary
  const tx = await storage.addItinerary("user1", '{"day1":"Visit beach"}');
  await tx.wait();
  console.log("Itinerary saved!");

  // Read it back
  const itinerary = await storage.getItinerary(0);
  console.log("Fetched itinerary:", itinerary);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
