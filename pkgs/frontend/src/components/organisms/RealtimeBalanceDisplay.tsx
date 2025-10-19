"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import { RefreshCw, TrendingUp } from "lucide-react";

interface Balance {
  chain: string;
  token: string;
  amount: string;
  usdValue: number;
}

interface RealtimeBalanceDisplayProps {
  initialBalances: Balance[];
}

export function RealtimeBalanceDisplay({
  initialBalances,
}: RealtimeBalanceDisplayProps) {
  const [balances, setBalances] = useState<Balance[]>(initialBalances);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshBalances = useCallback(async () => {
    setIsRefreshing(true);

    // モック: 実際にはAPIから最新の残高を取得
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // モック: 残高にランダムな変動を加える
    setBalances((prevBalances) => {
      const updatedBalances = prevBalances.map((balance) => ({
        ...balance,
        amount: (
          parseFloat(balance.amount) +
          (Math.random() - 0.5) * 0.1
        ).toFixed(2),
        usdValue: balance.usdValue + (Math.random() - 0.5) * 100,
      }));
      return updatedBalances;
    });

    setLastUpdated(new Date());
    setIsRefreshing(false);
  }, []);

  // 30秒ごとに自動更新
  useEffect(() => {
    const interval = setInterval(refreshBalances, 30000);
    return () => clearInterval(interval);
  }, [refreshBalances]);

  const totalUsdValue = balances.reduce((sum, b) => sum + b.usdValue, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              チェーン別残高
            </CardTitle>
            <CardDescription>
              全チェーンの現在残高をリアルタイム表示
            </CardDescription>
          </div>
          <button
            type="button"
            onClick={refreshBalances}
            disabled={isRefreshing}
            className="p-2 rounded-lg hover:bg-accent/10 transition-colors disabled:opacity-50"
            title="残高を更新"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        <div className="text-xs text-muted-foreground">
          最終更新: {lastUpdated.toLocaleTimeString("ja-JP")}
          {isRefreshing && " (更新中...)"}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {balances.map((balance) => (
            <div
              key={`${balance.chain}-${balance.token}`}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{balance.token}</span>
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {balance.chain}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${balance.usdValue.toLocaleString()} USD
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{balance.amount}</p>
                <p className="text-xs text-muted-foreground">{balance.token}</p>
              </div>
            </div>
          ))}

          {/* 合計表示 */}
          <div className="border-t pt-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">総資産価値</span>
              <span className="text-2xl font-bold text-accent">
                ${totalUsdValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
