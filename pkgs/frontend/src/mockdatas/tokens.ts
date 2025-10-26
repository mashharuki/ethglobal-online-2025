// 寄付ページ用の対応トークン一覧
export const mockSupportedTokens = [
  { symbol: "ETH", name: "Ethereum", chains: ["Sepolia", "Arbitrum Sepolia"] },
  { symbol: "USDC", name: "USD Coin", chains: ["Sepolia", "Arbitrum Sepolia"] },
  { symbol: "PYUSD", name: "PayPal USD", chains: ["Sepolia", "Arbitrum Sepolia"] },
];

// トークン情報の型定義
export interface TokenInfo {
  symbol: string;
  name: string;
  chains: string[];
}
