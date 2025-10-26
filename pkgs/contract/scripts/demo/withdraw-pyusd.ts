import { network } from "hardhat";

// Simulate post-conversion: deposit PYUSD into pool and withdraw to recipient
// Requires env: PYUSD_ADDRESS, POOL_ADDRESS

const PYUSD_ADDRESS = process.env.PYUSD_ADDRESS as `0x${string}` | undefined;
const POOL_ADDRESS = process.env.POOL_ADDRESS as `0x${string}` | undefined;
if (!PYUSD_ADDRESS || !POOL_ADDRESS) throw new Error("PYUSD_ADDRESS and POOL_ADDRESS are required");

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();
const [owner, recipient] = await viem.getWalletClients();

const pyusd = await viem.getContractAt("PYUSDToken", PYUSD_ADDRESS);
const pool = await viem.getContractAt("DonationPool", POOL_ADDRESS);

// Ensure PYUSD is supported (it should be by deploy script)
await pool.write.setSupportedToken([PYUSD_ADDRESS, true], { account: owner.account });

const deposit = 3_000_000n; // 3 PYUSD
const withdraw = 2_000_000n; // 2 PYUSD

console.log("[WITHDRAW-PYUSD] deposit PYUSD into pool via donate");
await pyusd.write.approve([pool.address, deposit], { account: owner.account });
await publicClient.waitForTransactionReceipt({
  hash: await pool.write.donate([PYUSD_ADDRESS, deposit], { account: owner.account }),
});

console.log("[WITHDRAW-PYUSD] pool PYUSD balance:", await pool.read.balanceOf([PYUSD_ADDRESS]));

console.log("[WITHDRAW-PYUSD] withdrawing to:", recipient.account.address);
await publicClient.waitForTransactionReceipt({
  hash: await pool.write.withdrawFunds([PYUSD_ADDRESS, withdraw, recipient.account.address], {
    account: owner.account,
  }),
});

console.log(
  "[WITHDRAW-PYUSD] done. pool PYUSD balance:",
  await pool.read.balanceOf([PYUSD_ADDRESS])
);
