const hre = require("hardhat");

async function main() {
  const DirectDeposit = await hre.ethers.getContractFactory("DirectDeposit");
  const directDeposit = await DirectDeposit.deploy();

  await directDeposit.deployed();

  console.log("DirectDeposit contract deployed to:", directDeposit.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });