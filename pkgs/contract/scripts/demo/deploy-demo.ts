import { network } from "hardhat";

// Deploy DonationPool + mock PYUSD/USDC, whitelist PYUSD, set sink
// Usage: pnpm hardhat run scripts/demo/deploy-demo.ts --network hardhat

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();
const [owner, sink, donor1] = await viem.getWalletClients();

console.log("[DEPLOY] chainId:", await publicClient.getChainId());

const pyusd = await viem.deployContract("PYUSDToken");
const usdc = await viem.deployContract("USDCToken");

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;

const pool = await viem.deployContract("DonationPool", [
  owner.account.address,
  usdc.address, // target token
  [pyusd.address, ZERO_ADDRESS], // support PYUSD + ETH
]);

// set sink to a dedicated wallet (sink)
await pool.write.setConversionSink([sink.account.address], { account: owner.account });

console.log("[DEPLOY] PYUSD:", pyusd.address);
console.log("[DEPLOY] USDC :", usdc.address);
console.log("[DEPLOY] Pool :", pool.address);
console.log("[DEPLOY] Sink :", sink.account.address);

console.log("Export env for next steps:");
console.log(`export PYUSD_ADDRESS=${pyusd.address}`);
console.log(`export USDC_ADDRESS=${usdc.address}`);
console.log(`export POOL_ADDRESS=${pool.address}`);
console.log(`export SINK_ADDRESS=${sink.account.address}`);
