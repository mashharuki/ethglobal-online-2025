import { network } from "hardhat";
import { getContract } from "viem";
import { ERC20_ABI } from "../helpers/abi/ERC20";
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

// token address from comand line args or default to USDC on Arbitrum Sepolia
const tokenAddress = process.argv[6] || "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"; // USDC on Arbitrum Sepolia
// "0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1"; // PYUSD on Arbitrum Sepolia
const amount = BigInt(1e6); // 1 USDC = 1e6

// create ERC20 contract instance using direct viem approach
const erc20Contract = getContract({
  address: tokenAddress as `0x${string}`,
  abi: ERC20_ABI,
  client: {
    public: publicClient,
    wallet: senderClient,
  },
});

// approve first
const approvalTx = await erc20Contract.write.approve([contractAddress, amount]);
await publicClient.waitForTransactionReceipt({ hash: approvalTx });

console.log(`Approve tx receipt: ${approvalTx}`);

// donate 1 USDC
const tx = await contract.write.donate([tokenAddress, amount]);
await publicClient.waitForTransactionReceipt({ hash: tx });

console.log(`Donate tx receipt: ${tx}`);

console.log("========================= [END] =========================");
