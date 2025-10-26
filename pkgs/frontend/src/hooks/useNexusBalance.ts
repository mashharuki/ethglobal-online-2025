import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useNexusSDK } from './useNexusSDK';
import { processNexusBalances } from '@/utils/balanceProcessor';
import { getErrorMessage, withRetry } from '@/utils/errorHandler';
import { mockUnifiedBalance } from '@/mockdatas';
import type { UnifiedBalance } from '@/types';

export const useNexusBalance = () => {
  const { address, isConnected, chainId } = useAccount();
  const { nexusSDK, isInitialized, initializeSDK } = useNexusSDK();
  const [unifiedBalance, setUnifiedBalance] = useState<UnifiedBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 現在のチェーンの残高を取得
  const { data: currentChainBalance } = useBalance({
    address: address,
    chainId: chainId,
  });

  const fetchUnifiedBalance = async () => {
    if (!isConnected || !address) {
      setUnifiedBalance(null);
      setError('Please connect your wallet first');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // SDK初期化
      await initializeSDK();

      // 残高取得をリトライ付きで実行
      const balances = await withRetry(async () => {
        return await nexusSDK.getUnifiedBalances();
      });

      if (balances && Array.isArray(balances) && balances.length > 0) {
        const processedBalance = processNexusBalances(balances, currentChainBalance, chainId);
        setUnifiedBalance(processedBalance);
      } else {
        setUnifiedBalance({
          totalUSD: 0,
          balances: [],
        });
      }
    } catch (err) {
      console.error('Nexus SDK error:', err);
      const errorMessage = getErrorMessage(err);
      setUnifiedBalance(mockUnifiedBalance);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ウォレット接続状態の変化を監視
  useEffect(() => {
    if (!isConnected || !address) {
      setUnifiedBalance(null);
      setError(null);
    }
  }, [isConnected, address]);

  return {
    unifiedBalance,
    loading,
    error,
    refetch: fetchUnifiedBalance,
    walletClientReady: isInitialized,
  };
};
