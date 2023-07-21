// Hardhat's Runtime Environment
const hre = require("hardhat");

async function main() {
  // Getting the contract factory for 'Campaign'
  const Campaign = await hre.ethers.getContractFactory("Campaign");

  // Deploying the contract with no arguments
  const campaign = await Campaign.deploy();

  // The contract is mined and deployed
  await campaign.deployed();

  // The address of the deployed contract is logged to the console
  console.log("Campaign contract deployed to:", campaign.address);
}

// The main function is executed
main()
  .then(() => process.exit(0)) // If it executes successfully, the process is exited with code 0
  .catch((error) => {
    console.error(error); // If an error is thrown, it is logged to the console
    process.exit(1); // The process is exited with code 1
  });
