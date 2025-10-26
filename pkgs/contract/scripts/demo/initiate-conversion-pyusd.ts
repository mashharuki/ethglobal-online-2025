import { network } from "hardhat";

// Initiate conversion from PYUSD to target chain (e.g., Avail)
// Requires env: PYUSD_ADDRESS, POOL_ADDRESS

const PYUSD_ADDRESS = process.env.PYUSD_ADDRESS as `0x${string}` | undefined;
const POOL_ADDRESS = process.env.POOL_ADDRESS as `0x${string}` | undefined;
if (!PYUSD_ADDRESS || !POOL_ADDRESS) throw new Error("PYUSD_ADDRESS and POOL_ADDRESS are required");

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();
const [owner] = await viem.getWalletClients();

const pool = await viem.getContractAt("DonationPool", POOL_ADDRESS);

const amount = 5_000_000n; // 5 PYUSD
const targetChain = "avail";
const targetRecipient = "0x" as `0x${string}`; // fill with recipient id as needed
const metadata = "0x" as `0x${string}`; // nexus metadata if needed

console.log("[CONVERT] owner:", owner.account.address);
console.log("[CONVERT] amount:", amount.toString());

const before = await pool.read.balanceOf([PYUSD_ADDRESS]);
const txHash = await pool.write.initiateConversion(
  [PYUSD_ADDRESS, amount, targetChain, targetRecipient, metadata],
  { account: owner.account, value: 0n }
);
await publicClient.waitForTransactionReceipt({ hash: txHash });
const after = await pool.read.balanceOf([PYUSD_ADDRESS]);

console.log("[CONVERT] pool PYUSD balance before:", before);
console.log("[CONVERT] pool PYUSD balance after :", after);
