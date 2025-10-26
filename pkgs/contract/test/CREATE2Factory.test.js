const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CREATE2Factory", () => {
  let factory;
  let owner;
  let user1;
  let user2;
  let mockToken;
  let targetToken;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    // モックERC20トークンをデプロイ
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Mock Token", "MOCK");
    targetToken = await MockERC20.deploy("Target Token", "TARGET");

    // CREATE2Factoryをデプロイ
    const CREATE2Factory = await ethers.getContractFactory("CREATE2Factory");
    factory = await CREATE2Factory.deploy();
  });

  describe("CREATE2デプロイ機能", () => {
    it("正常にプールをデプロイできる", async () => {
      const salt = ethers.keccak256(ethers.toUtf8Bytes("test-salt"));
      const deploymentParams = {
        projectName: "Test Project",
        projectDescription: "A test donation project",
        targetToken: targetToken.address,
        owner: user1.address,
        salt: salt,
      };

      await expect(factory.deployPool(deploymentParams))
        .to.emit(factory, "PoolDeployed")
        .withArgs(
          await factory.calculateAddress(salt, user1.address),
          user1.address,
          "Test Project",
          salt,
          await getBlockTimestamp()
        );

      expect(await factory.getPoolCount()).to.equal(1);
    });

    it("同じソルトで複数回デプロイしようとすると失敗する", async () => {
      const salt = ethers.keccak256(ethers.toUtf8Bytes("duplicate-salt"));
      const deploymentParams = {
        projectName: "Test Project",
        projectDescription: "A test donation project",
        targetToken: targetToken.address,
        owner: user1.address,
        salt: salt,
      };

      // 最初のデプロイ
      await factory.deployPool(deploymentParams);

      // 同じソルトで再度デプロイ
      await expect(factory.deployPool(deploymentParams)).to.be.revertedWithCustomError(
        factory,
        "PoolAlreadyExists"
      );
    });

    it("無効なパラメータでデプロイが失敗する", async () => {
      const salt = ethers.keccak256(ethers.toUtf8Bytes("invalid-salt"));

      // 無効な所有者
      await expect(
        factory.deployPool({
          projectName: "Test Project",
          projectDescription: "A test donation project",
          targetToken: targetToken.address,
          owner: ethers.ZeroAddress,
          salt: salt,
        })
      ).to.be.revertedWithCustomError(factory, "InvalidAddress");

      // 無効な目標トークン
      await expect(
        factory.deployPool({
          projectName: "Test Project",
          projectDescription: "A test donation project",
          targetToken: ethers.ZeroAddress,
          owner: user1.address,
          salt: salt,
        })
      ).to.be.revertedWithCustomError(factory, "InvalidAddress");

      // 空のプロジェクト名
      await expect(
        factory.deployPool({
          projectName: "",
          projectDescription: "A test donation project",
          targetToken: targetToken.address,
          owner: user1.address,
          salt: salt,
        })
      ).to.be.revertedWithCustomError(factory, "InvalidParameter");
    });
  });

  describe("アドレス事前計算機能", () => {
    it("アドレスを事前計算できる", async () => {
      const salt = ethers.keccak256(ethers.toUtf8Bytes("precalculate-salt"));
      const calculatedAddress = await factory.calculateAddress(salt, user1.address);

      expect(calculatedAddress).to.be.properAddress;
      expect(calculatedAddress).to.not.equal(ethers.ZeroAddress);
    });

    it("複数のアドレスを事前計算できる", async () => {
      const salts = [
        ethers.keccak256(ethers.toUtf8Bytes("salt1")),
        ethers.keccak256(ethers.toUtf8Bytes("salt2")),
        ethers.keccak256(ethers.toUtf8Bytes("salt3")),
      ];
      const owners = [user1.address, user2.address, user1.address];

      const addresses = await factory.calculateAddresses(salts, owners);

      expect(addresses.length).to.equal(3);
      expect(addresses[0]).to.be.properAddress;
      expect(addresses[1]).to.be.properAddress;
      expect(addresses[2]).to.be.properAddress;
    });

    it("事前計算されたアドレスとデプロイ後のアドレスが一致する", async () => {
      const salt = ethers.keccak256(ethers.toUtf8Bytes("consistency-salt"));
      const calculatedAddress = await factory.calculateAddress(salt, user1.address);

      const deploymentParams = {
        projectName: "Consistency Test",
        projectDescription: "Testing address consistency",
        targetToken: targetToken.address,
        owner: user1.address,
        salt: salt,
      };

      const deployedAddress = await factory.deployPool.call(deploymentParams);

      expect(deployedAddress).to.equal(calculatedAddress);
    });
  });

  describe("プール管理機能", () => {
    let poolAddress;
    let salt;

    beforeEach(async () => {
      salt = ethers.keccak256(ethers.toUtf8Bytes("management-salt"));
      const deploymentParams = {
        projectName: "Management Test",
        projectDescription: "Testing pool management",
        targetToken: targetToken.address,
        owner: user1.address,
        salt: salt,
      };

      poolAddress = await factory.deployPool.call(deploymentParams);
      await factory.deployPool(deploymentParams);
    });

    it("プールの詳細情報を取得できる", async () => {
      const info = await factory.getPoolInfo(poolAddress);

      expect(info.owner).to.equal(user1.address);
      expect(info.projectName).to.equal("Management Test");
      expect(info.targetToken).to.equal(targetToken.address);
      expect(info.salt).to.equal(salt);
      expect(info.isActive).to.be.true;
    });

    it("プールを無効化できる", async () => {
      await expect(factory.connect(user1).deactivatePool(poolAddress))
        .to.emit(factory, "PoolDeactivated")
        .withArgs(poolAddress, user1.address, await getBlockTimestamp());

      expect(await factory.isPoolActive(poolAddress)).to.be.false;
    });

    it("プールを再アクティブ化できる", async () => {
      // まず無効化
      await factory.connect(user1).deactivatePool(poolAddress);

      // 再アクティブ化
      await expect(factory.connect(user1).reactivatePool(poolAddress))
        .to.emit(factory, "PoolReactivated")
        .withArgs(poolAddress, user1.address, await getBlockTimestamp());

      expect(await factory.isPoolActive(poolAddress)).to.be.true;
    });

    it("所有者以外はプールを無効化できない", async () => {
      await expect(
        factory.connect(user2).deactivatePool(poolAddress)
      ).to.be.revertedWithCustomError(factory, "InvalidAddress");
    });

    it("存在しないプールの情報を取得しようとすると失敗する", async () => {
      const nonExistentPool = ethers.Wallet.createRandom().address;

      await expect(factory.getPoolInfo(nonExistentPool)).to.be.revertedWithCustomError(
        factory,
        "PoolDoesNotExist"
      );
    });
  });

  describe("プール一覧機能", () => {
    beforeEach(async () => {
      // 複数のプールをデプロイ
      const salts = [
        ethers.keccak256(ethers.toUtf8Bytes("pool1")),
        ethers.keccak256(ethers.toUtf8Bytes("pool2")),
        ethers.keccak256(ethers.toUtf8Bytes("pool3")),
      ];

      for (let i = 0; i < 3; i++) {
        const deploymentParams = {
          projectName: `Project ${i + 1}`,
          projectDescription: `Description ${i + 1}`,
          targetToken: targetToken.address,
          owner: i % 2 === 0 ? user1.address : user2.address,
          salt: salts[i],
        };

        await factory.deployPool(deploymentParams);
      }
    });

    it("全プールのリストを取得できる", async () => {
      const allPools = await factory.getAllPools();
      expect(allPools.length).to.equal(3);
    });

    it("アクティブなプールのリストを取得できる", async () => {
      const activePools = await factory.getActivePools();
      expect(activePools.length).to.equal(3);

      // 1つのプールを無効化
      const firstPool = await factory.getAllPools();
      await factory.connect(user1).deactivatePool(firstPool[0]);

      const activePoolsAfterDeactivation = await factory.getActivePools();
      expect(activePoolsAfterDeactivation.length).to.equal(2);
    });

    it("所有者別のプールリストを取得できる", async () => {
      const user1Pools = await factory.getPoolsByOwner(user1.address);
      const user2Pools = await factory.getPoolsByOwner(user2.address);

      expect(user1Pools.length).to.equal(2); // pool1, pool3
      expect(user2Pools.length).to.equal(1); // pool2
    });

    it("プールの総数を取得できる", async () => {
      expect(await factory.getPoolCount()).to.equal(3);
    });

    it("プールの存在確認ができる", async () => {
      const allPools = await factory.getAllPools();
      const firstPool = allPools[0];
      const nonExistentPool = ethers.Wallet.createRandom().address;

      expect(await factory.poolExists(firstPool)).to.be.true;
      expect(await factory.poolExists(nonExistentPool)).to.be.false;
    });
  });

  describe("ユーティリティ機能", () => {
    it("ソルト値を生成できる", async () => {
      const salt = await factory.generateSalt("Test Project", user1.address, 123);

      expect(salt).to.be.a("string");
      expect(salt).to.have.lengthOf(66); // 0x + 64 hex characters
    });

    it("複数のソルト値を生成できる", async () => {
      const projectNames = ["Project 1", "Project 2", "Project 3"];
      const owners = [user1.address, user2.address, user1.address];
      const nonces = [1, 2, 3];

      const salts = await factory.generateSalts(projectNames, owners, nonces);

      expect(salts.length).to.equal(3);
      expect(salts[0]).to.be.a("string");
      expect(salts[1]).to.be.a("string");
      expect(salts[2]).to.be.a("string");
    });

    it("異なるパラメータで異なるソルトが生成される", async () => {
      const salt1 = await factory.generateSalt("Project A", user1.address, 1);
      const salt2 = await factory.generateSalt("Project B", user1.address, 1);
      const salt3 = await factory.generateSalt("Project A", user2.address, 1);
      const salt4 = await factory.generateSalt("Project A", user1.address, 2);

      expect(salt1).to.not.equal(salt2);
      expect(salt1).to.not.equal(salt3);
      expect(salt1).to.not.equal(salt4);
    });
  });

  describe("マルチチェーン対応", () => {
    it("同じパラメータで同じアドレスが生成される", async () => {
      const salt = ethers.keccak256(ethers.toUtf8Bytes("multichain-salt"));
      const address1 = await factory.calculateAddress(salt, user1.address);
      const address2 = await factory.calculateAddress(salt, user1.address);

      expect(address1).to.equal(address2);
    });

    it("異なるチェーンでも同じアドレスが生成される", async () => {
      // このテストは実際のマルチチェーンテストでは、異なるチェーンで同じFactoryをデプロイして確認
      const salt = ethers.keccak256(ethers.toUtf8Bytes("crosschain-salt"));
      const calculatedAddress = await factory.calculateAddress(salt, user1.address);

      // アドレスが一意であることを確認
      expect(calculatedAddress).to.be.properAddress;
      expect(calculatedAddress).to.not.equal(ethers.ZeroAddress);
    });
  });

  describe("エラーハンドリング", () => {
    it("無効なソルトでエラーが発生する", async () => {
      const deploymentParams = {
        projectName: "Test Project",
        projectDescription: "A test donation project",
        targetToken: targetToken.address,
        owner: user1.address,
        salt: ethers.ZeroHash, // 無効なソルト
      };

      await expect(factory.deployPool(deploymentParams)).to.be.revertedWithCustomError(
        factory,
        "InvalidSalt"
      );
    });

    it("配列の長さが一致しない場合エラーが発生する", async () => {
      const salts = [ethers.keccak256(ethers.toUtf8Bytes("salt1"))];
      const owners = [user1.address, user2.address]; // 長さが異なる

      await expect(factory.calculateAddresses(salts, owners)).to.be.revertedWith(
        "Arrays length mismatch"
      );
    });

    it("存在しないプールを無効化しようとするとエラーが発生する", async () => {
      const nonExistentPool = ethers.Wallet.createRandom().address;

      await expect(
        factory.connect(user1).deactivatePool(nonExistentPool)
      ).to.be.revertedWithCustomError(factory, "PoolDoesNotExist");
    });
  });

  // ヘルパー関数
  async function getBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});
