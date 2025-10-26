const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationPool - セキュリティ機能テスト", function () {
  let donationPool;
  let owner;
  let donor1;
  let donor2;
  let attacker;
  let mockToken;
  let targetToken;

  beforeEach(async function () {
    [owner, donor1, donor2, attacker] = await ethers.getSigners();

    // モックERC20トークンをデプロイ
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Mock Token", "MOCK");
    targetToken = await MockERC20.deploy("Target Token", "TARGET");

    // DonationPoolをデプロイ
    const DonationPool = await ethers.getContractFactory("DonationPool");
    donationPool = await DonationPool.deploy(
      "Security Test Project",
      "A project for testing security features",
      targetToken.address,
      owner.address
    );

    // モックトークンをサポートトークンとして追加
    await donationPool.setSupportedToken(mockToken.address, true);
  });

  describe("アクセス制御", function () {
    it("所有者のみが管理者機能を実行できる", async function () {
      // 非所有者は管理者機能を実行できない
      await expect(
        donationPool.connect(donor1).setSupportedToken(mockToken.address, false)
      ).to.be.revertedWithCustomError(donationPool, "OwnableUnauthorizedAccount");

      await expect(
        donationPool.connect(donor1).updateDonationSettings(0, ethers.MaxUint256, false)
      ).to.be.revertedWithCustomError(donationPool, "OwnableUnauthorizedAccount");

      await expect(
        donationPool.connect(donor1).emergencyPause("Test reason")
      ).to.be.revertedWithCustomError(donationPool, "OwnableUnauthorizedAccount");
    });

    it("所有者は管理者機能を実行できる", async function () {
      // 所有者は管理者機能を実行できる
      await expect(donationPool.setSupportedToken(mockToken.address, false))
        .to.emit(donationPool, "TokenSupported")
        .withArgs(mockToken.address, false);

      await expect(donationPool.updateDonationSettings(0, ethers.MaxUint256, false))
        .to.emit(donationPool, "DonationSettingsUpdated")
        .withArgs(0, ethers.MaxUint256, false);
    });
  });

  describe("カスタムエラー", function () {
    it("無効なアドレスでカスタムエラーが発生する", async function () {
      await expect(
        donationPool.setSupportedToken(ethers.ZeroAddress, true)
      ).to.be.revertedWithCustomError(donationPool, "InvalidAddress");

      await expect(
        donationPool.setTargetToken(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(donationPool, "InvalidAddress");
    });

    it("無効な金額でカスタムエラーが発生する", async function () {
      await expect(
        donationPool.connect(donor1).donateETH({ value: 0 })
      ).to.be.revertedWithCustomError(donationPool, "InvalidAmount");

      await expect(
        donationPool.connect(donor1).donate(mockToken.address, 0)
      ).to.be.revertedWithCustomError(donationPool, "InvalidAmount");
    });

    it("寄付が無効化されている時にカスタムエラーが発生する", async function () {
      await donationPool.updateDonationSettings(0, ethers.MaxUint256, false);

      await expect(
        donationPool.connect(donor1).donateETH({ value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(donationPool, "DonationsDisabled");
    });

    it("サポートされていないトークンでカスタムエラーが発生する", async function () {
      const unsupportedToken = await ethers.deployContract("MockERC20", ["Unsupported", "UNS"]);
      await unsupportedToken.mint(donor1.address, ethers.parseEther("10"));
      await unsupportedToken.connect(donor1).approve(donationPool.address, ethers.MaxUint256);

      await expect(
        donationPool.connect(donor1).donate(unsupportedToken.address, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(donationPool, "TokenNotSupported");
    });
  });

  describe("緊急停止機能", function () {
    it("緊急停止を発動できる", async function () {
      await expect(donationPool.emergencyPause("Security breach detected"))
        .to.emit(donationPool, "EmergencyPaused")
        .withArgs(owner.address, await getBlockTimestamp(), "Security breach detected");

      expect(await donationPool.emergencyPaused()).to.be.true;
    });

    it("緊急停止中は寄付ができない", async function () {
      await donationPool.emergencyPause("Emergency stop");

      await expect(
        donationPool.connect(donor1).donateETH({ value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(donationPool, "EmergencyPaused");

      await expect(
        donationPool.connect(donor1).donate(mockToken.address, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(donationPool, "EmergencyPaused");
    });

    it("緊急停止を解除できる", async function () {
      await donationPool.emergencyPause("Emergency stop");
      await donationPool.emergencyUnpause();

      expect(await donationPool.emergencyPaused()).to.be.false;

      // 寄付が再び可能になる
      await expect(
        donationPool.connect(donor1).donateETH({ value: ethers.parseEther("1") })
      ).to.emit(donationPool, "ETHDonationReceived");
    });

    it("既に停止中の場合、エラーが発生する", async function () {
      await donationPool.emergencyPause("First pause");

      await expect(
        donationPool.emergencyPause("Second pause")
      ).to.be.revertedWithCustomError(donationPool, "InvalidConfiguration");
    });

    it("停止されていない場合、解除でエラーが発生する", async function () {
      await expect(
        donationPool.emergencyUnpause()
      ).to.be.revertedWithCustomError(donationPool, "InvalidConfiguration");
    });
  });

  describe("寄付者数制限", function () {
    beforeEach(async function () {
      // 最大寄付者数を2に設定
      await donationPool.updateSecuritySettings(2);
    });

    it("最大寄付者数に達すると寄付が拒否される", async function () {
      // 最初の寄付者
      await donationPool.connect(donor1).donateETH({ value: ethers.parseEther("1") });

      // 2番目の寄付者
      await donationPool.connect(donor2).donateETH({ value: ethers.parseEther("1") });

      // 3番目の寄付者（制限に達している）
      await expect(
        donationPool.connect(attacker).donateETH({ value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(donationPool, "InvalidConfiguration");
    });

    it("既存の寄付者は制限に関係なく寄付できる", async function () {
      // 最初の寄付
      await donationPool.connect(donor1).donateETH({ value: ethers.parseEther("1") });

      // 2番目の寄付者
      await donationPool.connect(donor2).donateETH({ value: ethers.parseEther("1") });

      // 既存の寄付者は再度寄付できる
      await expect(
        donationPool.connect(donor1).donateETH({ value: ethers.parseEther("1") })
      ).to.emit(donationPool, "ETHDonationReceived");
    });
  });

  describe("リエントランシー攻撃対策", function () {
    it("ReentrancyGuardが正しく動作する", async function () {
      // リエントランシー攻撃を試行するコントラクトをデプロイ
      const ReentrancyAttacker = await ethers.getContractFactory("ReentrancyAttacker");
      const attackerContract = await ReentrancyAttacker.deploy(donationPool.address);

      // 攻撃を試行
      await expect(
        attackerContract.attack({ value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(donationPool, "ReentrancyGuardReentrantCall");
    });
  });

  describe("設定値の検証", function () {
    it("無効な設定値でエラーが発生する", async function () {
      // 最小値が最大値を超える場合
      await expect(
        donationPool.updateDonationSettings(ethers.parseEther("10"), ethers.parseEther("5"), true)
      ).to.be.revertedWithCustomError(donationPool, "InvalidConfiguration");

      // 最大寄付者数が0の場合
      await expect(
        donationPool.updateSecuritySettings(0)
      ).to.be.revertedWithCustomError(donationPool, "InvalidConfiguration");
    });

    it("空のプロジェクト名でエラーが発生する", async function () {
      await expect(
        donationPool.updateProjectInfo("", "Valid description")
      ).to.be.revertedWithCustomError(donationPool, "InvalidConfiguration");
    });
  });

  describe("残高不足の検証", function () {
    it("残高不足で緊急引き出しが失敗する", async function () {
      await expect(
        donationPool.emergencyWithdrawETH(owner.address, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(donationPool, "InsufficientBalance");
    });

    it("トークン残高不足で緊急引き出しが失敗する", async function () {
      await expect(
        donationPool.emergencyWithdrawToken(mockToken.address, owner.address, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(donationPool, "InsufficientBalance");
    });
  });

  describe("トークン転送の安全性", function () {
    it("無効なアドレスへの転送が失敗する", async function () {
      await expect(
        donationPool.emergencyWithdrawETH(ethers.ZeroAddress, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(donationPool, "InvalidAddress");
    });

    it("ゼロ金額の転送が失敗する", async function () {
      await expect(
        donationPool.emergencyWithdrawETH(owner.address, 0)
      ).to.be.revertedWithCustomError(donationPool, "InvalidAmount");
    });
  });

  // ヘルパー関数
  async function getBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});

// リエントランシー攻撃を試行するコントラクト
contract ReentrancyAttacker {
    address public target;
    bool public attacking;

    constructor(address _target) {
        target = _target;
    }

    function attack() external payable {
        attacking = true;
        (bool success, ) = target.call{value: msg.value}("");
        require(success, "Attack failed");
    }

    receive() external payable {
        if (attacking && address(this).balance > 0) {
            attacking = false;
            (bool success, ) = target.call{value: address(this).balance}("");
            require(success, "Reentrancy attack failed");
        }
    }
}

