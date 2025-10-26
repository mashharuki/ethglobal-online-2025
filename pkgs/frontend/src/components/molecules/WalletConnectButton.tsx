'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useSDKInitialization } from '@/contexts/SDKInitializationContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import type { ResponsiveConfig, WalletConnectButtonProps, WalletInfo } from '@/types';
import { ConnectButton as ConnectButtonComponent } from './WalletConnectButton/ConnectButton';
import { ConnectedWallet } from './WalletConnectButton/ConnectedWallet';
import { UnsupportedChainButton } from './WalletConnectButton/UnsupportedChainButton';

export default function WalletConnectButton({ onConnectionChange }: WalletConnectButtonProps) {
  const { isTablet, isMobile, isDesktop, isLargeDesktop } = useMediaQuery();
  const { isConnected } = useWalletConnection();
  const { isSDKInitializing } = useSDKInitialization();

  const config: ResponsiveConfig = {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };

  // 接続状態の変更を監視
  useEffect(() => {
    if (onConnectionChange) {
      onConnectionChange(isConnected);
    }
  }, [isConnected, onConnectionChange]);

  return (
    <div className="flex items-center">
      {isSDKInitializing ? (
        // SDK初期化中はローディング状態を表示
        <div className="flex items-center bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold px-4 py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Initializing SDK...
        </div>
      ) : (
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus || authenticationStatus === 'authenticated');

            const walletInfo: WalletInfo = {
              address: account?.address,
              chainId: chain?.id,
              isConnected: !!connected,
              chain: chain
                ? {
                    id: chain.id,
                    name: chain.name || 'Unknown',
                    unsupported: chain.unsupported,
                    hasIcon: chain.hasIcon,
                    iconUrl: chain.iconUrl,
                    iconBackground: chain.iconBackground,
                  }
                : undefined,
            };

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {!connected ? (
                  <ConnectButtonComponent onConnect={openConnectModal} config={config} />
                ) : chain?.unsupported ? (
                  <UnsupportedChainButton onSwitchChain={openChainModal} config={config} />
                ) : (
                  <ConnectedWallet
                    walletInfo={walletInfo}
                    onSwitchChain={openChainModal}
                    onOpenAccount={openAccountModal}
                    config={config}
                  />
                )}
              </div>
            );
          }}
        </ConnectButton.Custom>
      )}
    </div>
  );
}
