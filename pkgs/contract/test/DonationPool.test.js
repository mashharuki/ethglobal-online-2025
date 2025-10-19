const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationPool", function () {
  let donationPool;
  let owner;
  let donor1;
  let donor2;
  let mockToken;
  let targetToken;

  beforeEach(async function () {
    [owner, donor1, donor2] = await ethers.getSigners();

    // モックERC20トークンをデプロイ
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Mock Token", "MOCK");
    targetToken = await MockERC20.deploy("Target Token", "TARGET");

    // DonationPoolをデプロイ
    const DonationPool = await ethers.getContractFactory("DonationPool");
    donationPool = await DonationPool.deploy(
      "Test Project",
      "A test donation project",
      targetToken.address,
      owner.address
    );

    // モックトークンをサポートトークンとして追加
    await donationPool.setSupportedToken(mockToken.address, true);
  });

  describe("初期化", function () {
    it("正しい初期値が設定される", async function () {
      expect(await donationPool.projectName()).to.equal("Test Project");
      expect(await donationPool.projectDescription()).to.equal("A test donation project");
      expect(await donationPool.targetToken()).to.equal(targetToken.address);
      expect(await donationPool.owner()).to.equal(owner.address);
      expect(await donationPool.donationsEnabled()).to.be.true;
      expect(await donationPool.minDonationAmount()).to.equal(0);
    });

    it("ETHがサポートトークンとして追加される", async function () {
      expect(await donationPool.supportedTokens(ethers.ZeroAddress)).to.be.true;
    });
  });

  describe("ETH寄付", function () {
    it("正常なETH寄付ができる", async function () {
      const donationAmount = ethers.parseEther("1.0");

      await expect(donationPool.connect(donor1).donateETH({ value: donationAmount }))
        .to.emit(donationPool, "ETHDonationReceived")
        .withArgs(donor1.address, donationAmount, await getBlockTimestamp());

      expect(await donationPool.getETHBalance()).to.equal(donationAmount);
      expect(await donationPool.totalDonations(ethers.ZeroAddress)).to.equal(donationAmount);
      expect(await donationPool.donorContributions(donor1.address)).to.equal(donationAmount);
    });

    it("receive関数でETH寄付ができる", async function () {
      const donationAmount = ethers.parseEther("0.5");

      await expect(donor1.sendTransaction({
        to: donationPool.address,
        value: donationAmount
      })).to.emit(donationPool, "ETHDonationReceived");

      expect(await donationPool.getETHBalance()).to.equal(donationAmount);
    });

    it("寄付が無効化されている時は寄付できない", async function () {
      await donationPool.updateDonationSettings(0, ethers.MaxUint256, false);

      await expect(donationPool.connect(donor1).donateETH({ value: ethers.parseEther("1.0") }))
        .to.be.revertedWith("DonationPool: Donations are disabled");
    });

    it("最小寄付額未満の寄付は拒否される", async function () {
      const minAmount = ethers.parseEther("1.0");
      await donationPool.updateDonationSettings(minAmount, ethers.MaxUint256, true);

      await expect(donationPool.connect(donor1).donateETH({ value: ethers.parseEther("0.5") }))
        .to.be.revertedWith("DonationPool: Donation below minimum");
    });
  });

  describe("ERC20トークン寄付", function () {
    beforeEach(async function () {
      // 寄付者にトークンを配布
      await mockToken.mint(donor1.address, ethers.parseEther("100"));
      await mockToken.mint(donor2.address, ethers.parseEther("100"));

      // 寄付者がコントラクトにトークン転送を許可
      await mockToken.connect(donor1).approve(donationPool.address, ethers.MaxUint256);
      await mockToken.connect(donor2).approve(donationPool.address, ethers.MaxUint256);
    });

    it("正常なERC20寄付ができる", async function () {
      const donationAmount = ethers.parseEther("10");

      await expect(donationPool.connect(donor1).donate(mockToken.address, donationAmount))
        .to.emit(donationPool, "TokenDonationReceived")
        .withArgs(donor1.address, mockToken.address, donationAmount, await getBlockTimestamp());

      expect(await donationPool.getTokenBalance(mockToken.address)).to.equal(donationAmount);
      expect(await donationPool.totalDonations(mockToken.address)).to.equal(donationAmount);
    });

    it("サポートされていないトークンは寄付できない", async function () {
      const unsupportedToken = await ethers.deployContract("MockERC20", ["Unsupported", "UNS"]);
      await unsupportedToken.mint(donor1.address, ethers.parseEther("10"));
      await unsupportedToken.connect(donor1).approve(donationPool.address, ethers.MaxUint256);

      await expect(donationPool.connect(donor1).donate(unsupportedToken.address, ethers.parseEther("1")))
        .to.be.revertedWith("DonationPool: Token not supported");
    });
  });

  describe("管理者機能", function () {
    it("所有者のみがサポートトークンを設定できる", async function () {
      const newToken = await ethers.deployContract("MockERC20", ["New Token", "NEW"]);

      await expect(donationPool.connect(donor1).setSupportedToken(newToken.address, true))
        .to.be.revertedWithCustomError(donationPool, "OwnableUnauthorizedAccount");

      await expect(donationPool.setSupportedToken(newToken.address, true))
        .to.emit(donationPool, "TokenSupported")
        .withArgs(newToken.address, true);
    });

    it("寄付設定を更新できる", async function () {
      const minAmount = ethers.parseEther("0.1");
      const maxAmount = ethers.parseEther("10");

      await expect(donationPool.updateDonationSettings(minAmount, maxAmount, true))
        .to.emit(donationPool, "DonationSettingsUpdated")
        .withArgs(minAmount, maxAmount, true);

      expect(await donationPool.minDonationAmount()).to.equal(minAmount);
      expect(await donationPool.maxDonationAmount()).to.equal(maxAmount);
    });

    it("目標トークンを変更できる", async function () {
      const newTargetToken = await ethers.deployContract("MockERC20", ["New Target", "TARGET2"]);

      await expect(donationPool.setTargetToken(newTargetToken.address))
        .to.emit(donationPool, "TargetTokenUpdated")
        .withArgs(targetToken.address, newTargetToken.address);

      expect(await donationPool.targetToken()).to.equal(newTargetToken.address);
    });
  });

  describe("緊急機能", function () {
    beforeEach(async function () {
      // コントラクトにETHとトークンを送金
      await donor1.sendTransaction({
        to: donationPool.address,
        value: ethers.parseEther("5")
      });

      await mockToken.mint(donationPool.address, ethers.parseEther("100"));
    });

    it("所有者は緊急時にETHを引き出せる", async function () {
      const withdrawAmount = ethers.parseEther("2");
      const initialBalance = await ethers.provider.getBalance(owner.address);

      await donationPool.emergencyWithdrawETH(owner.address, withdrawAmount);

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("所有者は緊急時にERC20トークンを引き出せる", async function () {
      const withdrawAmount = ethers.parseEther("50");

      await donationPool.emergencyWithdrawToken(mockToken.address, owner.address, withdrawAmount);

      expect(await mockToken.balanceOf(owner.address)).to.equal(withdrawAmount);
    });
  });

  // ヘルパー関数
  async function getBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});

// モックERC20コントラクト
contract MockERC20 {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");

        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;

        return true;
    }
}
