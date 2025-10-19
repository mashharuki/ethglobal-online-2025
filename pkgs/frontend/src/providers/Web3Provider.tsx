'use client';

import type { NexusNetwork } from '@avail-project/nexus-widgets';
import { NexusProvider } from '@avail-project/nexus-widgets';
import { getDefaultConfig, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { arbitrumSepolia, baseSepolia, optimismSepolia, polygonAmoy, sepolia } from 'wagmi/chains';
import { initializeAnalyticsSuppression } from '@/utils/analyticsSuppressor';

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

const defaultNetwork = (process.env.NEXT_PUBLIC_NETWORK ?? 'testnet') as NexusNetwork;

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Using demo project ID.');
}

const config = getDefaultConfig({
  appName: 'Nexus Sample App',
  projectId: walletConnectProjectId,
  chains: [sepolia, baseSepolia, arbitrumSepolia, optimismSepolia, polygonAmoy],
  ssr: false,
  batch: {
    multicall: false,
  },
  pollingInterval: 0,
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface Web3ContextValue {
  network: NexusNetwork;
  setNetwork: React.Dispatch<React.SetStateAction<NexusNetwork>>;
}

const Web3Context = createContext<Web3ContextValue | null>(null);

export function useWeb3Context() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3Context must be used within a Web3Provider');
  }
  return context;
}

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [network, setNetwork] = useState<NexusNetwork>(defaultNetwork);
  const [mounted, setMounted] = useState(false);
  const value = useMemo(() => ({ network, setNetwork }), [network]);

  useEffect(() => {
    setMounted(true);
    // Analytics SDKのエラー抑制を初期化
    initializeAnalyticsSuppression();
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <Web3Context.Provider value={value}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            modalSize="wide"
            theme={lightTheme({
              accentColor: '#fe8b6c',
              accentColorForeground: 'white',
              borderRadius: 'medium',
              fontStack: 'system',
            })}
            showRecentTransactions={false}
            appInfo={{
              appName: 'CrossDonate',
              learnMoreUrl: undefined,
            }}
            initialChain={sepolia}
          >
            <NexusProvider config={{ network }}>{children}</NexusProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Web3Context.Provider>
  );
};

export default Web3Provider;
