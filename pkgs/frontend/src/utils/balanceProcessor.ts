import type { NexusBalance, NexusBalanceBreakdown, TokenBalance, UnifiedBalance } from "@/types";

// チェーン名のマッピング関数
const getChainName = (chainId: number | string | undefined) => {
  if (!chainId) return "Unknown";

  const chainMap: Record<number | string, string> = {
    1: "Ethereum",
    11155111: "Sepolia",
    8453: "Base",
    84532: "Base Sepolia",
    42161: "Arbitrum One",
    421614: "Arbitrum Sepolia",
    10: "Optimism",
    11155420: "Optimism Sepolia",
    137: "Polygon",
    80002: "Polygon Amoy",
  };
  return chainMap[chainId] || `Chain ${chainId}`;
};

/**
 * Nexus SDKの残高データを処理してTokenBalance配列に変換
 */
export function processNexusBalances(
  balances: NexusBalance[],
  currentChainBalance?: {
    formatted: string;
    symbol: string;
    decimals: number;
    value: bigint;
  } | null,
  chainId?: number
): UnifiedBalance {
  const processedBalances: TokenBalance[] = [];

  balances.forEach((asset: NexusBalance) => {
    // breakdown配列がある場合は、各チェーンの残高を個別に処理
    if (asset.breakdown && Array.isArray(asset.breakdown)) {
      asset.breakdown.forEach((breakdownItem: NexusBalanceBreakdown) => {
        if (Number.parseFloat(breakdownItem.balance) > 0) {
          const chainInfo = breakdownItem.chain;
          const chainId =
            (typeof chainInfo === "object" ? chainInfo?.id : undefined) || breakdownItem.chainId;
          const chainName =
            (typeof chainInfo === "object" ? chainInfo?.name : chainInfo) ||
            breakdownItem.chainName ||
            getChainName(chainId);

          processedBalances.push({
            chain: chainName,
            token: asset.symbol,
            balance: breakdownItem.balance,
            symbol: asset.symbol,
            decimals: asset.decimals || 18,
            usdValue: asset.balanceInFiat
              ? (Number.parseFloat(breakdownItem.balance) / Number.parseFloat(asset.balance)) *
                asset.balanceInFiat
              : 0,
            chainId: typeof chainId === "string" ? Number.parseInt(chainId, 10) : chainId,
            contractAddress: breakdownItem.contractAddress,
            rawBalance: breakdownItem.rawBalance,
          });
        }
      });
    } else {
      // breakdown配列がない場合は、統合された残高を処理
      const chainId = asset.chainId ? Number.parseInt(asset.chainId.toString(), 10) : undefined;

      processedBalances.push({
        chain:
          asset.chainName || asset.chain || asset.network || getChainName(chainId) || "Unknown",
        token: asset.symbol || asset.token || "Unknown",
        balance: asset.balance || asset.amount || asset.formattedBalance || "0",
        symbol: asset.symbol || "Unknown",
        decimals: asset.decimals || 18,
        usdValue: asset.usdValue || asset.value || asset.priceUSD || asset.balanceInFiat || 0,
        chainId: chainId,
        contractAddress: asset.contractAddress,
        rawBalance: asset.rawBalance,
      });
    }
  });

  // 現在のチェーンの残高を追加（重複を避けるため、Nexus SDKに含まれていない場合のみ）
  if (currentChainBalance && chainId) {
    const existingEntry = processedBalances.find(
      (b) => b.chainId === chainId && b.symbol === currentChainBalance.symbol
    );

    if (!existingEntry) {
      const currentChainName = getChainName(chainId);
      const currentChainBalanceEntry: TokenBalance = {
        chain: currentChainName,
        token: currentChainBalance.symbol,
        balance: currentChainBalance.formatted,
        symbol: currentChainBalance.symbol,
        decimals: currentChainBalance.decimals,
        usdValue: 0,
        chainId: chainId,
        contractAddress: undefined,
        rawBalance: currentChainBalance.value.toString(),
      };

      processedBalances.push(currentChainBalanceEntry);
    }
  }

  // 総USD価値を計算
  const totalUSD = processedBalances.reduce((sum, balance) => {
    return sum + (balance.usdValue || 0);
  }, 0);

  return {
    totalUSD,
    balances: processedBalances,
  };
}
