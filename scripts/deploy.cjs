const hre = require("hardhat");

async function main() {
  const DirectDeposit = await hre.ethers.getContractFactory("DirectDeposit");

  // Specify the deployment transaction parameters
  const deploymentParameters = {
    gasLimit: ethers.utils.hexlify(4000000),  // Adjust gas limit as needed
    gasPrice: ethers.utils.parseUnits('100', 'gwei'),  // Adjust gas price as needed
  };
  
  const directDeposit = await DirectDeposit.deploy(deploymentParameters);

  await directDeposit.deployed();

  console.log("DirectDeposit contract deployed to:", directDeposit.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
