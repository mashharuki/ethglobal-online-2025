'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useWeb3Context } from '@/providers/Web3Provider';
import { useNexusSDK } from '@/hooks/useNexusSDK';
import BridgeAndExecuteTest from './BridgeAndExecuteTest';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/Dialog';

const Nexus = () => {
  const { isConnected } = useAccount();
  const { network } = useWeb3Context();
  const { isInitialized } = useNexusSDK();
  const [isBridgeAndExecuteOpen, setIsBridgeAndExecuteOpen] = useState(false);
  const [isBridgeAndSwapOpen, setIsBridgeAndSwapOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<'USDT' | 'USDC' | null>(null);
  const [isInitializing] = useState(false);

  return (
    <Card className="border-none shadow-none">
      <CardContent>
        <div className="flex flex-col justify-center items-center gap-y-4">
          <div className="w-full mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Nexus SDK Status</h3>
            <p className="text-sm text-blue-600">
              Network: {network} | Wallet: {isConnected ? 'Connected' : 'Not Connected'} | SDK:{' '}
              {isInitialized ? 'Initialized' : 'Not Initialized'}
            </p>
            {isInitializing && (
              <p className="text-sm text-orange-600 font-medium">SDK初期化中...</p>
            )}
          </div>
          <div className="w-full flex justify-center">
            <div className="bg-card rounded-lg border border-gray-400 p-6 shadow-sm text-center w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Bridge & Donate USDC</h3>
              <Button
                disabled={!isConnected}
                onClick={() => {
                  setSelectedToken('USDC');
                  setIsBridgeAndExecuteOpen(true);
                }}
                className="w-full font-bold rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isConnected ? 'Bridge & Donate USDC' : 'Connect Wallet First'}
              </Button>
            </div>
          </div>
        </div>

        {/* Bridge & Execute Test Modal (Donate) */}
        <Dialog open={isBridgeAndExecuteOpen} onOpenChange={setIsBridgeAndExecuteOpen}>
          <DialogContent className="w-[95vw] max-w-6xl max-h-[95vh] overflow-y-auto p-6 md:p-8">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {selectedToken
                  ? `${selectedToken} Bridge & Donate テスト`
                  : 'Bridge & Donate テスト'}
              </DialogTitle>
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium text-center">
                  ✅ USDC用のNexus SDK初期化完了！ テストを開始できます
                </p>
              </div>
            </DialogHeader>
            <BridgeAndExecuteTest selectedToken={selectedToken} />
          </DialogContent>
        </Dialog>

        {/* Bridge & Swap Test Modal */}
        <Dialog open={isBridgeAndSwapOpen} onOpenChange={setIsBridgeAndSwapOpen}>
          <DialogContent className="w-[95vw] max-w-6xl max-h-[95vh] overflow-y-auto p-6 md:p-8">
            <DialogHeader>
              <DialogTitle>
                {selectedToken ? `${selectedToken} Bridge & Swap テスト` : 'Bridge & Swap テスト'}
              </DialogTitle>
            </DialogHeader>
            <BridgeAndExecuteTest selectedToken={selectedToken} defaultFunction="swapUsdcToPyusd" />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default Nexus;
