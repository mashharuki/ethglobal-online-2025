import { network } from "hardhat";

// Donate PYUSD into the pool from donor1
// Requires env: PYUSD_ADDRESS, POOL_ADDRESS

const PYUSD_ADDRESS = process.env.PYUSD_ADDRESS as `0x${string}` | undefined;
const POOL_ADDRESS = process.env.POOL_ADDRESS as `0x${string}` | undefined;
if (!PYUSD_ADDRESS || !POOL_ADDRESS) throw new Error("PYUSD_ADDRESS and POOL_ADDRESS are required");

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();
const [owner, donor1] = await viem.getWalletClients();

const pyusd = await viem.getContractAt("PYUSDToken", PYUSD_ADDRESS);
const pool = await viem.getContractAt("DonationPool", POOL_ADDRESS);

const amount = 10_000_000n; // 10 PYUSD (6 decimals)

console.log("[DONATE] donor:", donor1.account.address);
console.log("[DONATE] amount:", amount.toString());

// fund donor1
await pyusd.write.transfer([donor1.account.address, amount], { account: owner.account });

// approve + donate
await pyusd.write.approve([pool.address, amount], { account: donor1.account });
const txHash = await pool.write.donate([PYUSD_ADDRESS, amount], { account: donor1.account });
await publicClient.waitForTransactionReceipt({ hash: txHash });

console.log("[DONATE] pool PYUSD balance:", await pool.read.balanceOf([PYUSD_ADDRESS]));
