// Nexus SDK関連の型定義

// チェーン情報の型
export interface ChainInfo {
  id: number;
  name: string;
  chainId?: number;
  network?: string;
}

// トークン残高の型
export interface TokenBalance {
  chain: string;
  token: string;
  balance: string;
  symbol: string;
  decimals: number;
  usdValue?: number;
  chainId?: number;
  contractAddress?: string;
  rawBalance?: string;
}

// 統合残高の型
export interface UnifiedBalance {
  totalUSD: number;
  balances: TokenBalance[];
}

// Nexus SDKの残高レスポンス型
export interface NexusBalance {
  symbol: string;
  balance: string;
  balanceInFiat?: number;
  abstracted?: boolean;
  chain?: string;
  chainId?: string | number;
  decimals?: number;
  chainName?: string;
  network?: string;
  token?: string;
  amount?: string;
  formattedBalance?: string;
  usdValue?: number;
  value?: number;
  priceUSD?: number;
  contractAddress?: string;
  rawBalance?: string;
  breakdown?: NexusBalanceBreakdown[];
}

// Nexus残高の内訳型
export interface NexusBalanceBreakdown {
  chain: string | ChainInfo;
  balance: string;
  chainId?: string | number;
  chainName?: string;
  network?: string;
  balanceInFiat?: number;
  usdValue?: number;
  symbol?: string;
  contractAddress?: string;
  rawBalance?: string;
}

// Ethereum プロバイダーの型
export interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => EthereumProvider;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => EthereumProvider;
  [key: string]: unknown;
}

// window.ethereum用の型定義
export interface WindowWithEthereum extends Window {
  ethereum?: EthereumProvider;
}
