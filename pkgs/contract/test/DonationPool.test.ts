import assert from "node:assert/strict";
import { before, beforeEach, describe, it } from "node:test";
import { network } from "hardhat";


describe("DonationPool", async function () {
 const { viem } = await network.connect();
 const publicClient = await viem.getPublicClient();
 // Create wallet clients for donors
 const [owner, donor1, donor2] = await viem.getWalletClients();


 it("Should not be able to donate unsupported contract test", async function () {
   // create targetToken
   const token = await viem.deployContract("ExampleToken");
   // deploy the DonationPool contract
   const donationPool = await viem.deployContract("DonationPool", [
     owner.account.address,
     token.address,
     [],
   ]);


   const donationAmount = 1n;


   // Transfer some tokens to donor1 first
   await token.write.transfer([donor1.account.address, donationAmount], {
     account: owner.account,
   });


   await token.write.approve([donationPool.address, donationAmount], {
     account: donor1.account,
   });


   // Donate 1n (1 wei) from donor1


   // Call donate function with proper value and get transaction hash
   try {
     await donationPool.write.donate([token.address, 1n], {
       account: donor1.account,
     });
   } catch (err: any) {
     console.log(err.details);
     assert.equal(true, err.details.includes("UnsupportedToken"));
   }
 });


 it("Should not be able to donate 0", async function () {
   // create targetToken
   const token = await viem.deployContract("ExampleToken");
   // deploy the DonationPool contract
   const donationPool = await viem.deployContract("DonationPool", [
     owner.account.address,
     token.address,
     [token.address],
   ]);


   const donationAmount = 0n;


   // Transfer some tokens to donor1 first
   await token.write.transfer([donor1.account.address, donationAmount], {
     account: owner.account,
   });


   await token.write.approve([donationPool.address, donationAmount], {
     account: donor1.account,
   });


   // Donate 1n (1 wei) from donor1


   // Call donate function with proper value and get transaction hash
   try {
     await donationPool.write.donate([token.address, donationAmount], {
       account: donor1.account,
     });
   } catch (err: any) {
     console.log(err.details);
     assert.equal(true, err.details.includes("ZeroAmount"));
   }
 });


 it("Should emit the donated event when calling the donate() function", async function () {
   // create targetToken
   const token = await viem.deployContract("ExampleToken");
   // deploy the DonationPool contract
   const donationPool = await viem.deployContract("DonationPool", [
     owner.account.address,
     token.address,
     [token.address],
   ]);


   const donationAmount = 1n;


   // Transfer some tokens to donor1 first
   await token.write.transfer([donor1.account.address, donationAmount], {
     account: owner.account,
   });


   await token.write.approve([donationPool.address, donationAmount], {
     account: donor1.account,
   });


   // Donate 1n (1 wei) from donor1


   // Call donate function with proper value and get transaction hash
   const txHash = await donationPool.write.donate(
     [token.address, donationAmount], // 👈 use token.address here
     { account: donor1.account } // donor1 is the msg.sender
   );


   // Get transaction receipt to verify events
   const receipt = await publicClient.waitForTransactionReceipt({
     hash: txHash,
   });


   // Parse events from the receipt
   const events = await publicClient.getContractEvents({
     address: donationPool.address,
     abi: donationPool.abi,
     eventName: "Donated",
     fromBlock: receipt.blockNumber,
     toBlock: receipt.blockNumber,
   });


   // Verify the Donated event was emitted with correct parameters
   assert.equal(events.length, 1, "Should emit exactly one Donated event");
   assert.equal(
     (events[0].args as any).donor.toLowerCase(),
     donor1.account.address.toLowerCase()
   );
   assert.equal((events[0].args as any).amount, donationAmount);
 });


 it("Should emit EtherDonated event when ETH is sent directly", async function () {
   const [owner, donor1] = await viem.getWalletClients();


   const token = await viem.deployContract("ExampleToken");


   // include ETH (address(0)) in supported tokens so receive() emits DonatedETH
   const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;
   const donationPool = await viem.deployContract("DonationPool", [
     owner.account.address,
     token.address,
     [token.address, ZERO_ADDRESS],
   ]);


   // send 0.1 ETH directly to the contract
   const ethAmount = 10n ** 17n; // 0.1 ether


   const txHash = await donor1.sendTransaction({
     to: donationPool.address,
     value: ethAmount,
   });


   const receipt = await publicClient.waitForTransactionReceipt({
     hash: txHash,
   });


   // query the EtherDonated event
   const events = await publicClient.getContractEvents({
     address: donationPool.address,
     abi: donationPool.abi,
     eventName: "DonatedETH",
     fromBlock: receipt.blockNumber,
     toBlock: receipt.blockNumber,
   });


   assert.equal(events.length, 1, "Should emit exactly one DonatedETH event");
   assert.equal((events[0].args as any).donor, donor1.account.address);
   assert.equal((events[0].args as any).amount, ethAmount);
 });
});




