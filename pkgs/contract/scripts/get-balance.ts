import { network } from "hardhat";

// Connect to the network and get the Viem public client
const { viem } = await network.connect();
// Use the public client to get the latest block number
const publicClient = await viem.getPublicClient();
// Get the first wallet client
const [senderClient] = await viem.getWalletClients();

console.log("========================= [START] =========================");
console.log("Sender address:", senderClient.account.address);
console.log("ChainID:", await publicClient.getChainId());
console.log("Latest block number:", await publicClient.getBlockNumber());
console.log("Balance:", await publicClient.getBalance({ address: senderClient.account.address }));
console.log("========================= [END] =========================");

