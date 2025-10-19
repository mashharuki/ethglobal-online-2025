const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying DonationPool contract...");

  // デプロイ用のパラメータ
  const projectName = "CrossDonate Test Project";
  const projectDescription = "A test donation project for CrossDonate platform";

  // モックERC20トークンをデプロイ（テスト用）
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const targetToken = await MockERC20.deploy("Target Token", "TARGET");
  await targetToken.waitForDeployment();

  console.log("Target token deployed to:", await targetToken.getAddress());

  // DonationPoolをデプロイ
  const DonationPool = await ethers.getContractFactory("DonationPool");
  const donationPool = await DonationPool.deploy(
    projectName,
    projectDescription,
    await targetToken.getAddress(),
    (await ethers.getSigners())[0].address,
  );

  await donationPool.waitForDeployment();

  console.log("DonationPool deployed to:", await donationPool.getAddress());
  console.log("Project name:", await donationPool.projectName());
  console.log("Target token:", await donationPool.targetToken());
  console.log("Owner:", await donationPool.owner());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
