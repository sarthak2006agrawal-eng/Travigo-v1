const hre = require("hardhat");
const { ethers } = hre;
const { keccak256, toUtf8Bytes } = ethers;
require("dotenv").config();

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("Usage: node interactTravelRecords.js <network> <command> [args...]");
    process.exit(1);
  }

  const network = args[0];
  const command = args[1];
  const commandArgs = args.slice(2);

  const [user] = await hre.ethers.getSigners();

  const contractAddress = process.env.TRAVEL_RECORDS_ADDRESS;
  if (!contractAddress) {
    throw new Error("Please set TRAVEL_RECORDS_ADDRESS in .env");
  }

  const travelRecords = await ethers.getContractAt("TravelRecords", contractAddress);
  console.log(`Using TravelRecords at: ${contractAddress} on network ${network}`);
  console.log(`Using account: ${user.address}`);

  if (command === "receipt") {
    if (commandArgs.length < 4) {
      console.error("Usage: receipt <category> <amount> <currency> <ipfsHash>");
      process.exit(1);
    }
    const [category, amount, currency, ipfsHash] = commandArgs;
    const hash = keccak256(toUtf8Bytes(ipfsHash));

    const tx = await travelRecords.storeReceipt(
      category,
      parseInt(amount),
      currency,
      ipfsHash,
      hash
    );
    await tx.wait();

    console.log("Stored receipt successfully!");
    console.log({
      category,
      amount,
      currency,
      ipfsHash,
      keccak256Hash: hash
    });

  } else if (command === "kyc") {
    if (commandArgs.length < 2) {
      console.error("Usage: kyc <docType> <ipfsHash>");
      process.exit(1);
    }
    const [docType, ipfsHash] = commandArgs;
    const hash = keccak256(toUtf8Bytes(ipfsHash));

    const tx = await travelRecords.storeKYC(
      docType,
      ipfsHash,
      hash
    );
    await tx.wait();

    console.log("Stored KYC doc successfully!");
    console.log({
      docType,
      ipfsHash,
      keccak256Hash: hash
    });

  } else if (command === "get") {
    let receipts = [];
    let kycDocs = [];

    try {
      receipts = await travelRecords.getReceipts(user.address);
      if (!receipts) receipts = [];
    } catch {
      console.warn(" No receipts found or empty storage.");
    }

    try {
      kycDocs = await travelRecords.getKYC(user.address);
      if (!kycDocs) kycDocs = [];
    } catch {
      console.warn(" No KYC records found or empty storage.");
    }

    console.log("Receipts:", receipts.length > 0 ? receipts : "None");
    console.log(" KYC Records:", kycDocs.length > 0 ? kycDocs : "None");

  } else {
    console.error("Unknown command. Available commands: receipt, kyc, get");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
