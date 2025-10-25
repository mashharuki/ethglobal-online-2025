import { network } from "hardhat";

// Minimal Nexus SDK stub interface for illustration
type NexusConversionParams = {
  conversionId: `0x${string}` | string;
  token: `0x${string}`;
  amount: bigint;
  targetChain: string;
  targetRecipient: `0x${string}` | string | Uint8Array;
  metadata: `0x${string}` | string | Uint8Array;
};

async function submitViaNexus(params: NexusConversionParams) {
  // TODO: Integrate Avail Nexus SDK here
  // e.g., await nexusClient.initiateTransfer({...})
  console.log("[NEXUS] submit conversion", {
    conversionId: params.conversionId,
    token: params.token,
    amount: params.amount.toString(),
    targetChain: params.targetChain,
  });
}

// Usage:
//   POOL_ADDRESS=0x... pnpm hardhat run scripts/nexus-listener.ts --network <name>
const POOL_ADDRESS = process.env.POOL_ADDRESS as `0x${string}` | undefined;
if (!POOL_ADDRESS) throw new Error("env POOL_ADDRESS is required");

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();

const pool = await viem.getContractAt("DonationPool", POOL_ADDRESS);

console.log("[NEXUS] Listening ConversionInitiated on", pool.address);
console.log("ChainId:", await publicClient.getChainId());

const unwatch = publicClient.watchContractEvent({
  address: pool.address,
  abi: pool.abi,
  eventName: "ConversionInitiated",
  // Set polling to true for HTTP transports
  poll: true,
  onError: (err) => console.error("[NEXUS] watch error", err),
  onLogs: async (logs) => {
    for (const log of logs) {
      const args = log.args as any;
      console.log("[NEXUS] ConversionInitiated log", args);
      try {
        await submitViaNexus({
          conversionId: args.conversionId,
          token: args.token,
          amount: args.amount,
          targetChain: args.targetChain,
          targetRecipient: args.targetRecipient,
          metadata: args.metadata,
        });
      } catch (e) {
        console.error("[NEXUS] submit error", e);
      }
    }
  },
});

// Keep process alive; SIGINT to exit
process.on("SIGINT", () => {
  console.log("[NEXUS] Stop listening");
  unwatch();
  process.exit(0);
});

setInterval(() => void 0, 10_000);

