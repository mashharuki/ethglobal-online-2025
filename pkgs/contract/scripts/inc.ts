import { network } from "hardhat";
import { getContractAddress } from "../helpers/contractJsonHelper.js";

// Connect to the network and get the Viem public client
const { viem } = await network.connect();
// Use the public client to get the latest block number
const publicClient = await viem.getPublicClient();
// Get the first wallet client
const [senderClient] = await viem.getWalletClients();

const chainId = (await publicClient.getChainId()).toString();
// get contract name
const contractName = "CounterModule#Counter";
// get contract address
const contractAddress = getContractAddress(chainId, contractName);

// create contract instance
const contract = await viem.getContractAt("Counter", contractAddress as `0x${string}`);

// get current count
const currentCount = await contract.read.x();

console.log("========================= [START] =========================");
console.log("contract Address:", contractAddress);
console.log("Current count:", Number(currentCount));

// increment count
const tx = await contract.write.inc();

await publicClient.waitForTransactionReceipt({ hash: tx });

const afterCount = await contract.read.x();

console.log("After count:", Number(afterCount));

console.log("========================= [END] =========================");
