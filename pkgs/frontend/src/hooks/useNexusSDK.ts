import { NexusSDK } from '@avail-project/nexus-core';
import { useEffect, useState } from 'react';
import { useAccount, useWalletClient, useConnectorClient } from 'wagmi';
import type { EthereumProvider, WindowWithEthereum } from '@/types';

// Nexus SDKのインスタンスを作成
const nexusSDK = new NexusSDK({
  network: 'testnet',
  debug: true,
});

export function useNexusSDK() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: connectorClient } = useConnectorClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastConnectedAddress, setLastConnectedAddress] = useState<string | null>(null);

  // ウォレットクライアントを取得する関数
  const getWalletClient = async (): Promise<EthereumProvider | null> => {
    let attempts = 0;
    const maxAttempts = 30; // 3秒間待機

    while (attempts < maxAttempts) {
      const client = walletClient || connectorClient;
      if (client) {
        return {
          ...client,
          on: (_event: string, _callback: (...args: unknown[]) => void) =>
            client as unknown as EthereumProvider,
          removeListener: (_event: string, _callback: (...args: unknown[]) => void) =>
            client as unknown as EthereumProvider,
        } as unknown as EthereumProvider;
      }

      // window.ethereumに直接アクセスを試行
      if (typeof window !== 'undefined' && (window as WindowWithEthereum).ethereum) {
        return (window as WindowWithEthereum).ethereum as EthereumProvider;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    // 最後の手段としてwindow.ethereumを返す
    if (typeof window !== 'undefined' && (window as WindowWithEthereum).ethereum) {
      return (window as WindowWithEthereum).ethereum as EthereumProvider;
    }

    return null;
  };

  // SDK初期化
  const initializeSDK = async (): Promise<boolean> => {
    if (!isConnected || !address) {
      return false;
    }

    // アドレスが変更された場合、Nexus SDKを再初期化
    const shouldReinitialize = !isInitialized || lastConnectedAddress !== address;

    if (shouldReinitialize) {
      const clientToUse = await getWalletClient();
      if (!clientToUse) {
        throw new Error('No wallet client available for initialization');
      }

      let ethereumProvider: EthereumProvider;

      if (clientToUse === (window as WindowWithEthereum).ethereum) {
        ethereumProvider = {
          ...clientToUse,
          request: clientToUse.request.bind(clientToUse) as EthereumProvider['request'],
          on: (_event: string, _callback: (...args: unknown[]) => void) => {
            return ethereumProvider;
          },
          removeListener: (_event: string, _callback: (...args: unknown[]) => void) => {
            return ethereumProvider;
          },
        };
      } else {
        ethereumProvider = {
          ...clientToUse,
          request: clientToUse.request.bind(clientToUse) as EthereumProvider['request'],
          on: (_event: string, _callback: (...args: unknown[]) => void) => {
            return ethereumProvider;
          },
          removeListener: (_event: string, _callback: (...args: unknown[]) => void) => {
            return ethereumProvider;
          },
        };
      }

      await nexusSDK.initialize(ethereumProvider);
      setIsInitialized(true);
      setLastConnectedAddress(address);
    }

    return true;
  };

  // ウォレット接続状態の変化を監視
  useEffect(() => {
    if (!isConnected || !address) {
      setIsInitialized(false);
      setLastConnectedAddress(null);
    }
  }, [isConnected, address]);

  return {
    nexusSDK,
    isInitialized,
    initializeSDK,
    getWalletClient,
  };
}
