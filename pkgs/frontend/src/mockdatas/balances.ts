// 管理者ページ用の残高データ
export const mockBalances = [
  { chain: "Sepolia", token: "ETH", amount: "2.5", usdValue: 6250 },
  { chain: "Sepolia", token: "PYUSD", amount: "1,200", usdValue: 1200 },
  { chain: "Arbitrum Sepolia", token: "ETH", amount: "1.8", usdValue: 4500 },
  { chain: "Arbitrum Sepolia", token: "USDC", amount: "3,450", usdValue: 3450 },
];

// Nexus SDK用の統一残高フォールバックデータ
export const mockUnifiedBalance = {
  totalUSD: 1250.75,
  balances: [
    {
      chain: "Ethereum",
      token: "ETH",
      balance: "0.5",
      symbol: "ETH",
      decimals: 18,
      usdValue: 1000,
    },
    {
      chain: "Ethereum",
      token: "USDC",
      balance: "1000",
      symbol: "USDC",
      decimals: 6,
      usdValue: 1000,
    },
    {
      chain: "Base",
      token: "ETH",
      balance: "0.1",
      symbol: "ETH",
      decimals: 18,
      usdValue: 200,
    },
    {
      chain: "Arbitrum",
      token: "USDT",
      balance: "500",
      symbol: "USDT",
      decimals: 6,
      usdValue: 500,
    },
    {
      chain: "Polygon",
      token: "MATIC",
      balance: "100",
      symbol: "MATIC",
      decimals: 18,
      usdValue: 50.75,
    },
  ],
};
