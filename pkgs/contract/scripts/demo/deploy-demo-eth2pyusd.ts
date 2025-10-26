import { network } from "hardhat";

// Deploy DonationPool + mock PYUSD, whitelist ETH + PYUSD, set sink
// Usage: pnpm hardhat run scripts/demo/deploy-demo-eth2pyusd.ts --network hardhat

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();
const [owner, sink] = await viem.getWalletClients();

console.log("[DEPLOY] chainId:", await publicClient.getChainId());

const pyusd = await viem.deployContract("PYUSDToken");

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;

const pool = await viem.deployContract("DonationPool", [
  owner.account.address,
  pyusd.address, // target token is PYUSD for ETH→PYUSD demo
  [ZERO_ADDRESS, pyusd.address], // support ETH + PYUSD
]);

// set sink to a dedicated wallet (sink)
await pool.write.setConversionSink([sink.account.address], { account: owner.account });

console.log("[DEPLOY] PYUSD:", pyusd.address);
console.log("[DEPLOY] Pool :", pool.address);
console.log("[DEPLOY] Sink :", sink.account.address);

console.log("Export env for next steps:");
console.log(`export PYUSD_ADDRESS=${pyusd.address}`);
console.log(`export POOL_ADDRESS=${pool.address}`);
console.log(`export SINK_ADDRESS=${sink.account.address}`);

