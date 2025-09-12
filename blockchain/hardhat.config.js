
require("dotenv").config();  
require("@nomicfoundation/hardhat-toolbox");

const { RPC_URL, PRIVATE_KEY, POLYGONSCAN_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost : { url : "http://127.0.0.1:8545"},
    polygonAmoy: {
      url: RPC_URL || "https://rpc-amoy.polygon.technology/",           
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: POLYGONSCAN_API_KEY || "",
    },
  },
};

