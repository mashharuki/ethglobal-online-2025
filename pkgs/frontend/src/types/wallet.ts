// ウォレット関連の型定義

// ウォレット接続状態の型
export interface WalletConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

// ウォレット接続ボタンのプロパティ型
export interface WalletConnectButtonProps {
  onConnectionChange?: (isConnected: boolean) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

// レスポンシブ設定の型
export interface ResponsiveConfig {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

// ウォレット情報の型
export interface WalletInfo {
  address: string | undefined;
  chainId: number | undefined;
  isConnected: boolean;
  chain:
    | {
        id: number;
        name: string;
        unsupported?: boolean;
        hasIcon?: boolean;
        iconUrl?: string;
        iconBackground?: string;
      }
    | undefined;
}
