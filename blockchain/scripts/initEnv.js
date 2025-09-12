const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
const examplePath = path.join(__dirname, "..", ".env.example");

function ensureEnvFile() {
  if (fs.existsSync(envPath)) {
    console.log(".env already exists. Skipping creation.");
    return;
  }
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log("Created .env from .env.example");
  } else {
    const template = [
      "# Auto-generated. Fill in your secrets",
      "AMOY_RPC_URL=",
      "PRIVATE_KEY=",
      "POLYGONSCAN_API_KEY=",
      "",
    ].join("\n");
    fs.writeFileSync(envPath, template);
    console.log("Created .env with default template");
  }
}

ensureEnvFile();


