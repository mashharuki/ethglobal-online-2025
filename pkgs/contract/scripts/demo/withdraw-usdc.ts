import { network } from "hardhat";

// Simulate post-conversion: donate USDC into pool and withdraw to recipient
// Requires env: USDC_ADDRESS, POOL_ADDRESS

const USDC_ADDRESS = process.env.USDC_ADDRESS as `0x${string}` | undefined;
const POOL_ADDRESS = process.env.POOL_ADDRESS as `0x${string}` | undefined;
if (!USDC_ADDRESS || !POOL_ADDRESS) throw new Error("USDC_ADDRESS and POOL_ADDRESS are required");

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();
const [owner, recipient] = await viem.getWalletClients();

const usdc = await viem.getContractAt("USDCToken", USDC_ADDRESS);
const pool = await viem.getContractAt("DonationPool", POOL_ADDRESS);

// Ensure USDC is supported
await pool.write.setSupportedToken([USDC_ADDRESS, true], { account: owner.account });

const deposit = 3_000_000n; // 3 USDC
const withdraw = 2_000_000n; // 2 USDC

console.log("[WITHDRAW] deposit USDC into pool via donate");
await usdc.write.approve([pool.address, deposit], { account: owner.account });
await publicClient.waitForTransactionReceipt({ hash: await pool.write.donate([USDC_ADDRESS, deposit], { account: owner.account }) });

console.log("[WITHDRAW] pool USDC balance:", await pool.read.balanceOf([USDC_ADDRESS]));

console.log("[WITHDRAW] withdrawing to:", recipient.account.address);
await publicClient.waitForTransactionReceipt({ hash: await pool.write.withdrawFunds([USDC_ADDRESS, withdraw, recipient.account.address], { account: owner.account }) });

console.log("[WITHDRAW] done. pool USDC balance:", await pool.read.balanceOf([USDC_ADDRESS]));

