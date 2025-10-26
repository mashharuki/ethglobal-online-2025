import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

describe("USDC -> PYUSD swap (1:1)", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, donor1, recipient] = await viem.getWalletClients();

  it("should swap 1:1 from USDC to PYUSD and send to recipient", async function () {
    // Deploy mock tokens
    const pyusd = await viem.deployContract("PYUSDToken");
    const usdc = await viem.deployContract("USDCToken");

    // Deploy pool with both tokens supported
    const pool = await viem.deployContract("DonationPool", [
      owner.account.address,
      pyusd.address,
      [pyusd.address, usdc.address],
    ]);

    // Prefund pool with PYUSD liquidity (owner -> donor1 -> donate)
    const pyusdLiquidity = 10_000_000n; // 10 PYUSD (6dec)
    await pyusd.write.transfer([donor1.account.address, pyusdLiquidity], { account: owner.account });
    await pyusd.write.approve([pool.address, pyusdLiquidity], { account: donor1.account });
    await publicClient.waitForTransactionReceipt({ hash: await pool.write.donate([pyusd.address, pyusdLiquidity], { account: donor1.account }) });

    // Simulate bridged USDC arriving to pool via donate
    const usdcIncoming = 5_000_000n; // 5 USDC
    await usdc.write.transfer([donor1.account.address, usdcIncoming], { account: owner.account });
    await usdc.write.approve([pool.address, usdcIncoming], { account: donor1.account });
    await publicClient.waitForTransactionReceipt({ hash: await pool.write.donate([usdc.address, usdcIncoming], { account: donor1.account }) });

    // Swap 5 USDC -> 5 PYUSD to recipient (1:1)
    const beforeRecipient = await pyusd.read.balanceOf([recipient.account.address]);
    const txHash = await pool.write.swapUsdcToPyusd([usdc.address, pyusd.address, usdcIncoming, recipient.account.address], { account: owner.account });
    await publicClient.waitForTransactionReceipt({ hash: txHash });
    const afterRecipient = await pyusd.read.balanceOf([recipient.account.address]);

    assert.equal(afterRecipient - beforeRecipient, usdcIncoming);

    // Pool balances should decrease accordingly
    const poolPyusd = (await pool.read.balanceOf([pyusd.address])) as bigint;
    const poolUsdc = (await pool.read.balanceOf([usdc.address])) as bigint;
    assert.equal(poolPyusd, pyusdLiquidity - usdcIncoming);
    assert.equal(poolUsdc, 0n);

    // Event check
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
    const events = await publicClient.getContractEvents({
      address: pool.address,
      abi: pool.abi,
      eventName: "Swapped",
      fromBlock: receipt.blockNumber,
      toBlock: receipt.blockNumber,
    });
    assert.equal(events.length, 1);
    assert.equal(
      ((events[0].args as any).fromToken as string).toLowerCase(),
      usdc.address.toLowerCase()
    );
    assert.equal(
      ((events[0].args as any).toToken as string).toLowerCase(),
      pyusd.address.toLowerCase()
    );
    assert.equal(
      ((events[0].args as any).to as string).toLowerCase(),
      recipient.account.address.toLowerCase()
    );
    assert.equal((events[0].args as any).amount, usdcIncoming);
  });

  it("should revert when PYUSD liquidity is insufficient", async function () {
    const pyusd = await viem.deployContract("PYUSDToken");
    const usdc = await viem.deployContract("USDCToken");
    const pool = await viem.deployContract("DonationPool", [
      owner.account.address,
      pyusd.address,
      [pyusd.address, usdc.address],
    ]);

    // Donate small PYUSD (1)
    await pyusd.write.transfer([donor1.account.address, 1_000_000n], { account: owner.account });
    await pyusd.write.approve([pool.address, 1_000_000n], { account: donor1.account });
    await publicClient.waitForTransactionReceipt({ hash: await pool.write.donate([pyusd.address, 1_000_000n], { account: donor1.account }) });

    // Donate larger USDC (2)
    await usdc.write.transfer([donor1.account.address, 2_000_000n], { account: owner.account });
    await usdc.write.approve([pool.address, 2_000_000n], { account: donor1.account });
    await publicClient.waitForTransactionReceipt({ hash: await pool.write.donate([usdc.address, 2_000_000n], { account: donor1.account }) });

    try {
      await pool.write.swapUsdcToPyusd([usdc.address, pyusd.address, 2_000_000n, recipient.account.address], { account: owner.account });
      assert.fail("Expected revert: InsufficientBalance");
    } catch (err: any) {
      assert.equal(true, String(err.details || err.message).includes("InsufficientBalance"));
    }
  });
});
