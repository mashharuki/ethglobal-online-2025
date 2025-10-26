import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { parseEther } from "viem/utils";

describe("DonationPool (base: donate ETH and permissions)", async function () {
  const { viem } = await network.connect();
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;
  const publicClient = await viem.getPublicClient();
  const [owner, donor1, donor2] = await viem.getWalletClients();

  const setInitialBalance = async (ownerAddress: `0x${string}`, balance: bigint) => {
    const balanceHex = `0x${balance.toString(16)}`;
    await (publicClient as any).request({
      method: "hardhat_setBalance",
      params: [ownerAddress, balanceHex],
    });
  };

  const prepareContract = async (ownerAddress: `0x${string}`, tokenArr?: `0x${string}`[]) => {
    const token = await viem.deployContract("ExampleToken");
    const donationPool = await viem.deployContract("DonationPool", [
      ownerAddress,
      token.address,
      tokenArr ? [token.address, ...tokenArr] : [token.address, ZERO_ADDRESS],
    ]);
    return { token, donationPool };
  };

  it("Should not be able to donate unsupported contract test", async function () {
    const otherToken = await viem.deployContract("ExampleToken");

    const { token, donationPool } = await prepareContract(owner.account.address);
    const donationAmount = 1n;

    await token.write.transfer([donor1.account.address, donationAmount], { account: owner.account });
    await token.write.approve([donationPool.address, donationAmount], { account: donor1.account });

    try {
      await donationPool.write.donate([otherToken.address, 1n], { account: donor1.account });
      assert.fail("Expected UnsupportedToken error");
    } catch (err: any) {
      assert.match(String(err.details || err.message), /UnsupportedToken/);
    }
  });

  it("Should not be able to donate 0", async function () {
    const token = await viem.deployContract("ExampleToken");
    const donationPool = await viem.deployContract("DonationPool", [
      owner.account.address,
      token.address,
      [token.address],
    ]);

    const donationAmount = 0n;

    await token.write.transfer([donor1.account.address, donationAmount], { account: owner.account });
    await token.write.approve([donationPool.address, donationAmount], { account: donor1.account });

    try {
      await donationPool.write.donate([token.address, donationAmount], { account: donor1.account });
      assert.fail("Expected ZeroAmount error");
    } catch (err: any) {
      assert.equal(true, String(err.details || err.message).includes("ZeroAmount"));
    }
  });

  it("Should emit the donated event when calling the donate() function", async function () {
    const { token, donationPool } = await prepareContract(owner.account.address, []);
    const donationAmount = 1n;

    await token.write.transfer([donor1.account.address, donationAmount], { account: owner.account });
    await token.write.approve([donationPool.address, donationAmount], { account: donor1.account });

    const txHash = await donationPool.write.donate([token.address, donationAmount], { account: donor1.account });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    const events = await publicClient.getContractEvents({
      address: donationPool.address,
      abi: donationPool.abi,
      eventName: "Donated",
      fromBlock: receipt.blockNumber,
      toBlock: receipt.blockNumber,
    });

    assert.equal(events.length, 1, "Should emit exactly one Donated event");
    assert.equal(((events[0].args as any).donor as string).toLowerCase(), donor1.account.address.toLowerCase());
    assert.equal((events[0].args as any).amount, donationAmount);
  });

  it("Should emit EtherDonated event when ETH is sent directly", async function () {
    const { donationPool } = await prepareContract(owner.account.address, [ZERO_ADDRESS]);

    const ethAmount = parseEther("0.01");

    const txHash = await donor1.sendTransaction({ to: donationPool.address, value: ethAmount });
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    const events = await publicClient.getContractEvents({
      address: donationPool.address,
      abi: donationPool.abi,
      eventName: "DonatedETH",
      fromBlock: receipt.blockNumber,
      toBlock: receipt.blockNumber,
    });

    assert.equal(events.length, 1, "Should emit exactly one DonatedETH event");
    assert.equal(((events[0].args as any).donor as string).toLowerCase(), donor1.account.address.toLowerCase());
    assert.equal((events[0].args as any).amount, ethAmount);
  });

  it("Should accept ETH donation via donateETH()", async function () {
    const token = await viem.deployContract("ExampleToken");
    const donationPool = await viem.deployContract("DonationPool", [
      owner.account.address,
      token.address,
      [token.address, ZERO_ADDRESS],
    ]);

    const weiAmount = 2n;

    try {
      const txHash = await donationPool.write.donateETH({ account: donor1.account, value: weiAmount });
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash, timeout: 30000 });

      const events = await publicClient.getContractEvents({
        address: donationPool.address,
        abi: donationPool.abi,
        eventName: "DonatedETH",
        fromBlock: receipt.blockNumber,
        toBlock: receipt.blockNumber,
      });
      assert.equal((events[0].args as any).amount, weiAmount);
    } catch (err) {
      console.info(`donate ETH Error: ${err}`);
    }

    const balance = await donationPool.read.balanceOf([ZERO_ADDRESS]);
    assert.equal(balance, weiAmount, "Donation pool should have correct ETH balance");
  });

  it("Should allow owner to manage supported tokens", async function () {
    await setInitialBalance(owner.account.address, parseEther("100"));
    const { token, donationPool } = await prepareContract(owner.account.address, []);

    const donationAmount = 1n;
    await token.write.transfer([donor1.account.address, donationAmount], { account: owner.account });
    await token.write.approve([donationPool.address, donationAmount], { account: donor1.account });

    const newToken = await viem.deployContract("ExampleToken");

    try {
      await donationPool.write.donate([newToken.address, donationAmount], { account: donor1.account });
      assert.fail("Expected UnsupportedToken error");
    } catch (err: any) {
      assert.match(String(err.details || err.message), /UnsupportedToken/);
    }

    await donationPool.write.setSupportedToken([newToken.address, true], { account: owner.account });

    await newToken.write.transfer([donor1.account.address, donationAmount], { account: owner.account });
    await newToken.write.approve([donationPool.address, donationAmount], { account: donor1.account });

    await donationPool.write.donate([newToken.address, donationAmount], { account: donor1.account });

    const balance = await donationPool.read.balanceOf([newToken.address]);
    assert.equal(balance, donationAmount, "Donation pool should have correct newToken balance");
  });

  it("Should reject non-owner admin calls", async function () {
    await setInitialBalance(owner.account.address, parseEther("100"));
    const { donationPool } = await prepareContract(owner.account.address, []);
    const newToken = await viem.deployContract("ExampleToken");

    try {
      await donationPool.write.setSupportedToken([newToken.address, true], { account: donor1.account });
      assert.fail("Expected NotOwner error");
    } catch (err: any) {
      assert.match(String(err.details || err.message), /OwnableUnauthorizedAccount/);
    }

    try {
      await donationPool.write.setTargetToken([newToken.address], { account: donor1.account });
      assert.fail("Expected NotOwner error");
    } catch (err: any) {
      assert.match(String(err.details || err.message), /OwnableUnauthorizedAccount/);
    }
  });
});

