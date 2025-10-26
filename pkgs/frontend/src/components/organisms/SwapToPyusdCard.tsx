'use client';

import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { ArrowLeftRight, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { parseUnits } from 'viem';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

// DonationPool contract ABI (swapUsdcToPyusd function only)
const DONATION_POOL_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'usdc', type: 'address' },
      { internalType: 'address', name: 'pyusd', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'swapUsdcToPyusd',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllBalances',
    outputs: [
      { internalType: 'address[]', name: 'tokens', type: 'address[]' },
      { internalType: 'uint256[]', name: 'balances', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Contract addresses (Arbitrum Sepolia)
const DONATION_POOL_ADDRESS = '0x025755dfebe6eEF0a58cEa71ba3A417f4175CAa3' as const;
const USDC_ADDRESS = '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d' as const;
const PYUSD_ADDRESS = '0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1' as const;

interface SwapToPyusdCardProps {
  className?: string;
}

export function SwapToPyusdCard({ className }: SwapToPyusdCardProps) {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState<string | null>(null);

  const {
    data: hash,
    error: writeError,
    isPending: isWritePending,
    writeContract,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSwap = async () => {
    if (!isConnected || !address) {
      setError('Wallet is not connected');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!recipient || recipient.length !== 42 || !recipient.startsWith('0x')) {
      setError('Please enter a valid recipient address');
      return;
    }

    setError(null);

    try {
      // Convert amount to Wei units (USDC/PYUSD has 6 decimal places)
      const amountWei = parseUnits(amount, 6);

      writeContract({
        address: DONATION_POOL_ADDRESS,
        abi: DONATION_POOL_ABI,
        functionName: 'swapUsdcToPyusd',
        args: [USDC_ADDRESS, PYUSD_ADDRESS, amountWei, recipient as `0x${string}`],
      });
    } catch (err) {
      console.error('Swap error:', err);
      setError(`Swap execution error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <ArrowLeftRight className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">USDC → PYUSD Swap</CardTitle>
            <CardDescription className="text-base">
              Convert USDC from donation pool to PYUSD and send
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Message */}
        {isConfirmed && (
          <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl flex items-center gap-3 shadow-lg">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800">Swap completed successfully!</p>
              {hash && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-green-600">Tx Hash:</span>
                  <a
                    href={`https://sepolia.arbiscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:text-green-800 font-mono flex items-center gap-1"
                  >
                    {hash.slice(0, 10)}...{hash.slice(-8)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {(error || writeError) && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl">
            <p className="text-sm font-semibold text-red-800">
              {error || writeError?.message}
            </p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Swap Amount (USDC)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="100.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.000001"
              min="0"
              className="text-lg h-12"
            />
            <p className="text-xs text-gray-500">
              Swap the specified amount from donation pool USDC balance to PYUSD at 1:1 ratio
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm font-medium">
              Recipient Address
            </Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="font-mono text-sm h-12"
            />
            <p className="text-xs text-gray-500">
              Enter the address to receive the swapped PYUSD
            </p>
          </div>
        </div>

        {/* Information Box */}
        <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-4 space-y-3">
          <h4 className="font-semibold text-blue-800">Important Information</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex justify-between">
              <span>Swap Rate:</span>
              <span className="font-semibold">1 USDC = 1 PYUSD</span>
            </div>
            <div className="flex justify-between">
              <span>Network:</span>
              <span className="font-semibold">Arbitrum Sepolia</span>
            </div>
            <div className="flex justify-between">
              <span>Contract:</span>
              <a
                href={`https://sepolia.arbiscan.io/address/${DONATION_POOL_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs hover:text-blue-900 flex items-center gap-1"
              >
                {DONATION_POOL_ADDRESS.slice(0, 6)}...{DONATION_POOL_ADDRESS.slice(-4)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Execute Button */}
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl text-base h-12"
          onClick={handleSwap}
          disabled={!isConnected || isWritePending || isConfirming || !amount || !recipient}
        >
          {isWritePending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending transaction...
            </>
          ) : isConfirming ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Confirming...
            </>
          ) : !isConnected ? (
            'Please connect wallet'
          ) : (
            <>
              <ArrowLeftRight className="w-5 h-5 mr-2" />
              Execute USDC → PYUSD Swap
            </>
          )}
        </Button>

        <p className="text-xs text-center text-gray-500 leading-relaxed">
          This swap can only be executed with DonationPool contract owner permissions
        </p>
      </CardContent>
    </Card>
  );
}
