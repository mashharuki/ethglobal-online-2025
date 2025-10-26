'use client';

import { CheckCircle2, Loader2, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';

interface AdminConversionCardProps {
  targetToken: string;
  targetChain: string;
  totalUsdValue: number;
}

export function AdminConversionCard({
  targetToken,
  targetChain,
  totalUsdValue,
}: AdminConversionCardProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionComplete, setConversionComplete] = useState(false);

  const handleConversion = async () => {
    setIsConverting(true);
    setConversionComplete(false);

    // モック: 実際にはAvail Nexus SDKを使用
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsConverting(false);
    setConversionComplete(true);

    setTimeout(() => setConversionComplete(false), 5000);
  };

  return (
    <Card className="border-2 border-accent/20 shadow-xl">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-chart-3 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">変換・引き出し</CardTitle>
            <CardDescription className="text-base">
              全ての寄付を{targetToken}に変換して引き出し
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {conversionComplete && (
          <div className="bg-accent/10 border-2 border-accent/30 p-4 rounded-xl flex items-center gap-3 shadow-lg">
            <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
            <p className="text-sm font-semibold text-accent-foreground">変換が完了しました!</p>
          </div>
        )}

        <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">変換後の推定額</span>
            <span className="text-xl font-bold text-primary">
              ~{(totalUsdValue * 0.98).toLocaleString()} {targetToken}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">ガス代・手数料</span>
            <span className="text-sm font-semibold text-muted-foreground">~2%</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t-2 border-border">
            <span className="font-bold">受取先</span>
            <span className="text-sm font-mono font-semibold text-accent">{targetChain}</span>
          </div>
        </div>

        <Button
          className="w-full gradient-primary text-white shadow-xl text-base"
          size="lg"
          onClick={handleConversion}
          disabled={isConverting}
        >
          {isConverting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              変換中...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Convert & Withdraw
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground leading-relaxed">
          Avail Nexus SDKを使用して自動的にスワップ・ブリッジします
        </p>
      </CardContent>
    </Card>
  );
}
