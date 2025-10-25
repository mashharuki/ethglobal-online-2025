const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationPool - 残高管理機能の詳細テスト", function () {
  let donationPool;
  let owner;
  let donor1;
  let donor2;
  let mockToken1;
  let mockToken2;
  let targetToken;

  beforeEach(async function () {
    [owner, donor1, donor2] = await ethers.getSigners();

    // 複数のモックERC20トークンをデプロイ
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken1 = await MockERC20.deploy("Token 1", "TK1");
    mockToken2 = await MockERC20.deploy("Token 2", "TK2");
    targetToken = await MockERC20.deploy("Target Token", "TARGET");

    // DonationPoolをデプロイ
    const DonationPool = await ethers.getContractFactory("DonationPool");
    donationPool = await DonationPool.deploy(
      "Balance Test Project",
      "A project for testing balance management",
      targetToken.address,
      owner.address,
    );

    // 複数のトークンをサポートトークンとして追加
    await donationPool.setSupportedToken(mockToken1.address, true);
    await donationPool.setSupportedToken(mockToken2.address, true);
  });

  describe("基本的な残高取得機能", function () {
    it("ETH残高を正しく取得できる", async function () {
      // 初期残高は0
      let balance = await donationPool.getBalance(ethers.ZeroAddress);
      expect(balance).to.equal(0);

      // ETHを送金
      await donor1.sendTransaction({
        to: donationPool.address,
        value: ethers.parseEther("2.5"),
      });

      // 残高を確認
      balance = await donationPool.getBalance(ethers.ZeroAddress);
      expect(balance).to.equal(ethers.parseEther("2.5"));
    });

    it("ERC20トークン残高を正しく取得できる", async function () {
      // トークンをコントラクトに送金
      await mockToken1.mint(donationPool.address, ethers.parseEther("100"));
      await mockToken2.mint(donationPool.address, ethers.parseEther("50"));

      // 残高を確認
      const balance1 = await donationPool.getBalance(mockToken1.address);
      const balance2 = await donationPool.getBalance(mockToken2.address);

      expect(balance1).to.equal(ethers.parseEther("100"));
      expect(balance2).to.equal(ethers.parseEther("50"));
    });

    it("存在しないトークンアドレスに対しては0を返す", async function () {
      const nonExistentToken = ethers.Wallet.createRandom().address;
      const balance = await donationPool.getBalance(nonExistentToken);
      expect(balance).to.equal(0);
    });

    it("無効なトークンコントラクトに対しては0を返す", async function () {
      // 無効なアドレス（コントラクトではない）
      const invalidAddress = "0x0000000000000000000000000000000000000001";
      const balance = await donationPool.getBalance(invalidAddress);
      expect(balance).to.equal(0);
    });
  });

  describe("一括残高取得機能", function () {
    beforeEach(async function () {
      // テスト用の残高を設定
      await donor1.sendTransaction({
        to: donationPool.address,
        value: ethers.parseEther("3"),
      });

      await mockToken1.mint(donationPool.address, ethers.parseEther("200"));
      await mockToken2.mint(donationPool.address, ethers.parseEther("150"));
    });

    it("全サポートトークンの残高を一括取得できる", async function () {
      const [tokens, balances] = await donationPool.getAllBalances();

      // ETHのみがサポートされている状態
      expect(tokens.length).to.equal(1);
      expect(tokens[0]).to.equal(ethers.ZeroAddress);
      expect(balances[0]).to.equal(ethers.parseEther("3"));
    });

    it("指定されたトークンリストの残高を取得できる", async function () {
      const tokenList = [
        ethers.ZeroAddress, // ETH
        mockToken1.address, // Token 1
        mockToken2.address, // Token 2
        ethers.Wallet.createRandom().address, // 存在しないトークン
      ];

      const balances = await donationPool.getBalances(tokenList);

      expect(balances.length).to.equal(4);
      expect(balances[0]).to.equal(ethers.parseEther("3")); // ETH
      expect(balances[1]).to.equal(ethers.parseEther("200")); // Token 1
      expect(balances[2]).to.equal(ethers.parseEther("150")); // Token 2
      expect(balances[3]).to.equal(0); // 存在しないトークン
    });

    it("空のトークンリストに対しては空の配列を返す", async function () {
      const balances = await donationPool.getBalances([]);
      expect(balances.length).to.equal(0);
    });
  });

  describe("詳細な残高情報取得", function () {
    beforeEach(async function () {
      await donor1.sendTransaction({
        to: donationPool.address,
        value: ethers.parseEther("1.5"),
      });
    });

    it("詳細な残高情報を正しく取得できる", async function () {
      const [tokenAddresses, tokenBalances, tokenNames, tokenSymbols] =
        await donationPool.getDetailedBalances();

      expect(tokenAddresses.length).to.equal(1);
      expect(tokenAddresses[0]).to.equal(ethers.ZeroAddress);
      expect(tokenBalances[0]).to.equal(ethers.parseEther("1.5"));
      expect(tokenNames[0]).to.equal("Ethereum");
      expect(tokenSymbols[0]).to.equal("ETH");
    });
  });

  describe("統計情報取得", function () {
    beforeEach(async function () {
      // 初期残高を設定
      await donor1.sendTransaction({
        to: donationPool.address,
        value: ethers.parseEther("2"),
      });

      await mockToken1.mint(donationPool.address, ethers.parseEther("100"));
    });

    it("特定トークンの統計情報を正しく取得できる", async function () {
      // ETHの統計
      const ethStats = await donationPool.getTokenStats(ethers.ZeroAddress);
      expect(ethStats.totalDonated).to.equal(0);
      expect(ethStats.currentBalance).to.equal(ethers.parseEther("2"));
      expect(ethStats.isSupported).to.be.true;

      // Token 1の統計
      const token1Stats = await donationPool.getTokenStats(mockToken1.address);
      expect(token1Stats.totalDonated).to.equal(0);
      expect(token1Stats.currentBalance).to.equal(ethers.parseEther("100"));
      expect(token1Stats.isSupported).to.be.true;
    });

    it("寄付後の統計が正しく更新される", async function () {
      // 寄付を実行
      await donationPool
        .connect(donor1)
        .donateETH({ value: ethers.parseEther("0.5") });

      // 統計を確認
      const ethStats = await donationPool.getTokenStats(ethers.ZeroAddress);
      expect(ethStats.totalDonated).to.equal(ethers.parseEther("0.5"));
      expect(ethStats.currentBalance).to.equal(ethers.parseEther("2.5")); // 2 + 0.5
    });

    it("ERC20寄付後の統計が正しく更新される", async function () {
      // 寄付者がトークンを取得
      await mockToken1.mint(donor1.address, ethers.parseEther("50"));
      await mockToken1
        .connect(donor1)
        .approve(donationPool.address, ethers.MaxUint256);

      // 寄付を実行
      await donationPool
        .connect(donor1)
        .donate(mockToken1.address, ethers.parseEther("25"));

      // 統計を確認
      const tokenStats = await donationPool.getTokenStats(mockToken1.address);
      expect(tokenStats.totalDonated).to.equal(ethers.parseEther("25"));
      expect(tokenStats.currentBalance).to.equal(ethers.parseEther("125")); // 100 + 25
    });
  });

  describe("エラーハンドリング", function () {
    it("無効なトークンアドレスに対して安全に処理する", async function () {
      // 無効なアドレス
      const invalidAddresses = [
        "0x0000000000000000000000000000000000000000", // ゼロアドレス
        "0x0000000000000000000000000000000000000001", // 存在しないアドレス
        "0x1234567890123456789012345678901234567890", // ランダムアドレス
      ];

      for (const address of invalidAddresses) {
        const balance = await donationPool.getBalance(address);
        expect(balance).to.equal(0);
      }
    });

    it("大量のトークンリストに対して安全に処理する", async function () {
      // 大量のトークンアドレスを作成
      const tokenList = [];
      for (let i = 0; i < 10; i++) {
        tokenList.push(ethers.Wallet.createRandom().address);
      }

      const balances = await donationPool.getBalances(tokenList);
      expect(balances.length).to.equal(10);

      // 全て0であることを確認
      for (const balance of balances) {
        expect(balance).to.equal(0);
      }
    });
  });

  describe("ガス効率性", function () {
    it("view関数はガスを消費しない", async function () {
      // 残高取得はview関数なのでガスを消費しない
      const tx = await donationPool.getBalance(ethers.ZeroAddress);
      expect(tx).to.be.a("bigint");
    });

    it("複数の残高取得を効率的に実行できる", async function () {
      const tokenList = [
        ethers.ZeroAddress,
        mockToken1.address,
        mockToken2.address,
      ];

      // 複数の残高取得を並行して実行
      const promises = tokenList.map((token) => donationPool.getBalance(token));
      const balances = await Promise.all(promises);

      expect(balances.length).to.equal(3);
    });
  });

  describe("残高の整合性", function () {
    it("寄付前後の残高が正しく更新される", async function () {
      const initialBalance = await donationPool.getBalance(ethers.ZeroAddress);

      // 寄付を実行
      await donationPool
        .connect(donor1)
        .donateETH({ value: ethers.parseEther("1") });

      const finalBalance = await donationPool.getBalance(ethers.ZeroAddress);
      expect(finalBalance).to.equal(initialBalance + ethers.parseEther("1"));
    });

    it("複数回の寄付が正しく累積される", async function () {
      // 複数回寄付
      await donationPool
        .connect(donor1)
        .donateETH({ value: ethers.parseEther("1") });
      await donationPool
        .connect(donor2)
        .donateETH({ value: ethers.parseEther("2") });

      const totalBalance = await donationPool.getBalance(ethers.ZeroAddress);
      expect(totalBalance).to.equal(ethers.parseEther("3"));
    });
  });
});
