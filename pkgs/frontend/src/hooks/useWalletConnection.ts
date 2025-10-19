import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import type { WalletConnectionState } from '@/types';

/**
 * ウォレット接続状態を管理するフック
 */
export function useWalletConnection() {
  const { isConnected, address } = useAccount();
  const [connectionState, setConnectionState] = useState<WalletConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  // 接続状態の変化を監視
  useEffect(() => {
    setConnectionState((prev) => ({
      ...prev,
      isConnected: !!isConnected && !!address,
    }));
  }, [isConnected, address]);

  return {
    ...connectionState,
    address,
  };
}
