import { network } from "hardhat";

// Donate ETH into the pool from donor1 using donateETH
// Requires env: POOL_ADDRESS

const POOL_ADDRESS = process.env.POOL_ADDRESS as `0x${string}` | undefined;
if (!POOL_ADDRESS) throw new Error("POOL_ADDRESS is required");

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();
const [owner, donor1] = await viem.getWalletClients();

const pool = await viem.getContractAt("DonationPool", POOL_ADDRESS);

const ethAmount = 10n ** 16n; // 0.01 ETH

console.log("[DONATE-ETH] donor:", donor1.account.address);
console.log("[DONATE-ETH] amount:", ethAmount.toString());

const before = await pool.read.balanceOf(["0x0000000000000000000000000000000000000000"]);
const txHash = await pool.write.donateETH([], { account: donor1.account, value: ethAmount });
await publicClient.waitForTransactionReceipt({ hash: txHash });
const after = await pool.read.balanceOf(["0x0000000000000000000000000000000000000000"]);

console.log("[DONATE-ETH] pool ETH balance before:", before);
console.log("[DONATE-ETH] pool ETH balance after :", after);
