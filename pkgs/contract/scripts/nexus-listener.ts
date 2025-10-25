import { network } from "hardhat";

// ConversionInitiated event args (from DonationPool)
type ConversionInitiatedArgs = {
  conversionId: `0x${string}`;
  token: `0x${string}`;
  amount: bigint;
  targetChain: string;
  targetRecipient: `0x${string}` | Uint8Array;
  sink: `0x${string}`;
  metadata: `0x${string}` | Uint8Array;
};

// Minimal Nexus SDK stub interface for illustration
type NexusConversionParams = ConversionInitiatedArgs;

function isHexString(v: unknown, expectedLength?: number): v is `0x${string}` {
  return (
    typeof v === "string" &&
    v.startsWith("0x") &&
    (expectedLength === undefined || v.length === expectedLength)
  );
}

function isBytesLike(v: unknown): v is `0x${string}` | Uint8Array {
  return isHexString(v) || v instanceof Uint8Array;
}

function isAddress(v: unknown): v is `0x${string}` {
  return isHexString(v, 42);
}

function isConversionInitiatedArgs(x: unknown): x is ConversionInitiatedArgs {
  if (typeof x !== "object" || x === null) return false;
  const a: any = x;
  return (
    isHexString(a.conversionId, 66) &&
    isAddress(a.token) &&
    typeof a.amount === "bigint" &&
    typeof a.targetChain === "string" &&
    isBytesLike(a.targetRecipient) &&
    isAddress(a.sink) &&
    isBytesLike(a.metadata)
  );
}

async function submitViaNexus(params: NexusConversionParams) {
  // TODO: Integrate Avail Nexus SDK here
  // e.g., await nexusClient.initiateTransfer({...})
  console.log("[NEXUS] submit conversion", {
    conversionId: params.conversionId,
    token: params.token,
    amount: params.amount.toString(),
    targetChain: params.targetChain,
    sink: params.sink,
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
      const argsUnknown: unknown = (log as { args: unknown }).args;
      if (!isConversionInitiatedArgs(argsUnknown)) {
        console.warn("[NEXUS] unexpected event args shape", argsUnknown);
        continue;
      }
      const args = argsUnknown;
      console.log("[NEXUS] ConversionInitiated log", args);
      try {
        await submitViaNexus({
          conversionId: args.conversionId,
          token: args.token,
          amount: args.amount,
          targetChain: args.targetChain,
          targetRecipient: args.targetRecipient,
          sink: args.sink,
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
