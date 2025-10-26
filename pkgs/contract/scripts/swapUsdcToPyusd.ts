import { network } from "hardhat";
import { getContractAddress } from "../helpers/contractJsonHelper";

// Connect to the network and get the Viem public client
const { viem } = await network.connect();
// Use the public client to get the latest block number
const publicClient = await viem.getPublicClient();
// Get the first wallet client
const [senderClient] = await viem.getWalletClients();

console.log("========================= [START] =========================");
console.log("Sender address:", senderClient.account.address);
console.log("ChainID:", await publicClient.getChainId());

const chainId = (await publicClient.getChainId()).toString();
// get contract name
const contractName = "DonationPoolModule#DonationPool";
// get contract address
const contractAddress = getContractAddress(chainId, contractName);

console.log(`Donating to contract ${contractName} at address: ${contractAddress}`);

// create contract instance
const contract = await viem.getContractAt("DonationPool", contractAddress as `0x${string}`);

// USDC on Arbitrum Sepolia
const usdcAddress = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";
// PYUSD on Arbitrum Sepolia
const pyusdAddress = "0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1";

const amount = BigInt(1e6); // 1 USDC = 1e6

// swap 1 USDC to 1 PYUSD
const tx = await contract.write.swapUsdcToPyusd([usdcAddress, pyusdAddress, amount, senderClient.account.address]);
await publicClient.waitForTransactionReceipt({ hash: tx });

console.log(`Swap tx receipt: ${tx}`);

console.log("========================= [END] =========================");

