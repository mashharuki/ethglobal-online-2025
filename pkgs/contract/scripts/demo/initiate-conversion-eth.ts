import { network } from "hardhat";

// Initiate conversion from ETH to target (PYUSD on other chain)
// Requires env: POOL_ADDRESS

const POOL_ADDRESS = process.env.POOL_ADDRESS as `0x${string}` | undefined;
if (!POOL_ADDRESS) throw new Error("POOL_ADDRESS is required");

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();
const [owner] = await viem.getWalletClients();

const pool = await viem.getContractAt("DonationPool", POOL_ADDRESS);

const poolEth = (await pool.read.balanceOf([ZERO_ADDRESS])) as bigint;
if (poolEth === 0n) throw new Error("Pool has no ETH. Run donate-eth first.");
const amount = poolEth / 2n > 0n ? poolEth / 2n : poolEth; // convert half

const targetChain = "avail";
const targetRecipient = "0x" as `0x${string}`; // fill with recipient id as needed
const metadata = "0x" as `0x${string}`; // nexus metadata if needed

console.log("[CONVERT-ETH] owner:", owner.account.address);
console.log("[CONVERT-ETH] amount:", amount.toString());

const txHash = await pool.write.initiateConversion(
  [ZERO_ADDRESS, amount, targetChain, targetRecipient, metadata],
  { account: owner.account, value: 0n }
);
await publicClient.waitForTransactionReceipt({ hash: txHash });

console.log("[CONVERT-ETH] submitted ConversionInitiated. Check the nexus listener.");
