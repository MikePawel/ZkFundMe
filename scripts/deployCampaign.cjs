const hre = require("hardhat");

async function main() {
  const Campaign = await hre.ethers.getContractFactory("Campaign");
  const campaign = await Campaign.deploy();

  await campaign.deployed();

  console.log("Campaign contract deployed to:", campaign.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
