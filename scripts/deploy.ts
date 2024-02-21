import { ethers } from "hardhat";

async function main() {

  const swap = await ethers.deployContract("Swap");

  await swap.waitForDeployment();

  console.log(
    `contract deployed to ${swap.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
