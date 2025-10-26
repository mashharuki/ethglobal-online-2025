import { ethers } from "hardhat";

interface DeploymentParams {
  projectName: string;
  projectDescription: string;
  targetToken: string;
  owner: string;
  salt: string;
}

interface PoolInfo {
  owner: string;
  projectName: string;
  projectDescription: string;
  targetToken: string;
  salt: string;
  deploymentTime: number;
  isActive: boolean;
}

async function main(): Promise<void> {
  console.log("Deploying CrossDonate contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. CREATE2Factoryをデプロイ
  console.log("\n1. Deploying CREATE2Factory...");
  const CREATE2Factory = await ethers.getContractFactory("CREATE2Factory");
  const factory = await CREATE2Factory.deploy();
  await factory.waitForDeployment();
  console.log("CREATE2Factory deployed to:", await factory.getAddress());

  // 2. モックERC20トークンをデプロイ（テスト用）
  console.log("\n2. Deploying mock ERC20 tokens...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const targetToken = await MockERC20.deploy("Target Token", "TARGET");
  await targetToken.waitForDeployment();
  console.log("Target token deployed to:", await targetToken.getAddress());

  // 3. CREATE2を使用してDonationPoolをデプロイ
  console.log("\n3. Deploying DonationPool using CREATE2...");
  const projectName = "CrossDonate Test Project";
  const projectDescription = "A test donation project for CrossDonate platform";
  const salt = ethers.keccak256(ethers.toUtf8Bytes("crossdonate-test-salt"));
 
  // アドレスを事前計算
  const calculatedAddress = await factory.calculateAddress(
    salt,
    deployer.address,
  );
  console.log("Calculated address:", calculatedAddress);
 
  // デプロイパラメータを準備
  const deploymentParams: DeploymentParams = {
    projectName: projectName,
    projectDescription: projectDescription,
    targetToken: await targetToken.getAddress(),
    owner: deployer.address,
    salt: salt,
  };
 
  // CREATE2を使用してデプロイ
  const poolAddress = await factory.deployPool.call(deploymentParams);
  await factory.deployPool(deploymentParams);
  console.log("DonationPool deployed to:", poolAddress);
  console.log(
    "Address matches calculation:",
    poolAddress === calculatedAddress,
  );

  // 4. デプロイされたプールの情報を確認
  console.log("\n4. Verifying deployed pool...");
  const poolInfo: PoolInfo = await factory.getPoolInfo(poolAddress);
  console.log("Pool owner:", poolInfo.owner);
  console.log("Project name:", poolInfo.projectName);
  console.log("Target token:", poolInfo.targetToken);
  console.log("Is active:", poolInfo.isActive);

  // 5. 統計情報を表示
  console.log("\n5. Factory statistics...");
  console.log("Total pools:", await factory.getPoolCount());
  console.log("All pools:", await factory.getAllPools());
  console.log("Active pools:", await factory.getActivePools());

  // 6. マルチチェーン対応のデモンストレーション
  console.log("\n6. Multi-chain address consistency test...");
  const testSalts: string[] = [
    ethers.keccak256(ethers.toUtf8Bytes("chain1-salt")),
    ethers.keccak256(ethers.toUtf8Bytes("chain2-salt")),
    ethers.keccak256(ethers.toUtf8Bytes("chain3-salt")),
  ];
 
  const testOwners: string[] = [deployer.address, deployer.address, deployer.address];
  const calculatedAddresses: string[] = await factory.calculateAddresses(
    testSalts,
    testOwners,
  );
 
  console.log("Multi-chain addresses:");
  for (let i = 0; i < calculatedAddresses.length; i++) {
    console.log(`Chain ${i + 1}:`, calculatedAddresses[i]);
  }

  console.log("\n✅ All contracts deployed successfully!");
  console.log("\n📋 Deployment Summary:");
  console.log("- CREATE2Factory:", await factory.getAddress());
  console.log("- Target Token:", await targetToken.getAddress());
  console.log("- DonationPool:", poolAddress);
  console.log("- Salt used:", salt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
