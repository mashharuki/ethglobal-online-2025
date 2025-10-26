import { useSDKInitialization } from "@/contexts/SDKInitializationContext";
import type { EthereumProvider, WindowWithEthereum } from "@/types";
import { NexusSDK } from "@avail-project/nexus-core";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useConnectorClient, useWalletClient } from "wagmi";

// 環境変数からネットワーク設定を取得
const networkMode = (process.env.NEXT_PUBLIC_NETWORK ?? "testnet") as "mainnet" | "testnet";

// Nexus SDKのインスタンスを作成
const nexusSDK = new NexusSDK({
  network: networkMode,
  debug: true,
});

export function useNexusSDK() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: connectorClient } = useConnectorClient();
  const { setIsSDKInitializing } = useSDKInitialization();
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastConnectedAddress, setLastConnectedAddress] = useState<string | null>(null);

  // 状態更新関数を安定化
  const updateInitializedState = useCallback((value: boolean) => {
    console.log("updateInitializedState called with:", value);
    setIsInitialized(value);
  }, []);

  const updateLastConnectedAddress = useCallback((value: string | null) => {
    console.log("updateLastConnectedAddress called with:", value);
    setLastConnectedAddress(value);
  }, []);

  // ウォレットクライアントを取得する関数（シンプル版）
  const getWalletClient = async (): Promise<EthereumProvider | null> => {
    // まずwagmiのクライアントを試行
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

    // window.ethereumに直接アクセス
    if (typeof window !== "undefined" && (window as WindowWithEthereum).ethereum) {
      return (window as WindowWithEthereum).ethereum as EthereumProvider;
    }

    return null;
  };

  // SDK初期化
  const initializeSDK = async (): Promise<void> => {
    if (!isConnected || !address) {
      throw new Error("ウォレットが接続されていません");
    }

    // アドレスが変更された場合、Nexus SDKを再初期化
    const shouldReinitialize = !isInitialized || lastConnectedAddress !== address;

    if (shouldReinitialize) {
      // SDK初期化開始を通知
      setIsSDKInitializing(true);

      try {
        const clientToUse = await getWalletClient();
        if (!clientToUse) {
          throw new Error("ウォレットクライアントが利用できません");
        }

        let ethereumProvider: EthereumProvider;

        if (clientToUse === (window as WindowWithEthereum).ethereum) {
          ethereumProvider = {
            ...clientToUse,
            request: clientToUse.request.bind(clientToUse) as EthereumProvider["request"],
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
            request: clientToUse.request.bind(clientToUse) as EthereumProvider["request"],
            on: (_event: string, _callback: (...args: unknown[]) => void) => {
              return ethereumProvider;
            },
            removeListener: (_event: string, _callback: (...args: unknown[]) => void) => {
              return ethereumProvider;
            },
          };
        }

        await nexusSDK.initialize(ethereumProvider);

        // 状態を更新
        updateInitializedState(true);
        updateLastConnectedAddress(address);
      } catch (error) {
        console.error("Nexus SDK初期化エラー:", error);
        setIsInitialized(false);
        throw error; // エラーを再投げして呼び出し元で処理できるようにする
      } finally {
        // SDK初期化完了を通知
        setIsSDKInitializing(false);
      }
    }
  };

  // ウォレット接続状態の変化を監視
  useEffect(() => {
    if (!isConnected || !address) {
      updateInitializedState(false);
      updateLastConnectedAddress(null);
    } else if (address && lastConnectedAddress && address !== lastConnectedAddress) {
      updateInitializedState(false);
      updateLastConnectedAddress(null);
    }
  }, [
    isConnected,
    address,
    lastConnectedAddress,
    updateInitializedState,
    updateLastConnectedAddress,
  ]);

  return {
    nexusSDK,
    isInitialized,
    initializeSDK,
    getWalletClient,
  };
}
