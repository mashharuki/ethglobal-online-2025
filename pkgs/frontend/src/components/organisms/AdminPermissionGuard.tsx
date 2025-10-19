"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Shield, AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdminPermissionGuardProps {
  projectId: string;
  children: React.ReactNode;
}

export function AdminPermissionGuard({
  projectId,
  children,
}: AdminPermissionGuardProps) {
  const { address, isConnected } = useAccount();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (!isConnected || !address) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // モック: 実際にはスマートコントラクトで権限確認
      // ここでは管理者アドレスをハードコード（本番では動的に取得）
      const adminAddresses = [
        "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", // モック管理者アドレス
        "0x1234567890123456789012345678901234567890", // 追加管理者
      ];

      const hasPermission = adminAddresses.some(
        (adminAddr) => adminAddr.toLowerCase() === address.toLowerCase(),
      );

      setIsAuthorized(hasPermission);
      setIsLoading(false);
    };

    checkPermission();
  }, [address, isConnected, projectId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <h2 className="text-xl font-bold mb-2">権限確認中...</h2>
            <p className="text-muted-foreground">管理者権限を確認しています</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-accent" />
            </div>
            <CardTitle className="text-xl">ウォレット接続が必要</CardTitle>
            <CardDescription>
              管理者ダッシュボードにアクセスするにはウォレットを接続してください
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" className="w-full gradient-primary text-white">
              ウォレットを接続
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-destructive/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">アクセス権限がありません</CardTitle>
            <CardDescription>
              このプロジェクトの管理者権限がありません。管理者に連絡してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">接続中のウォレット:</p>
              <code className="text-xs font-mono break-all">{address}</code>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/">ホームに戻る</Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/donate/${projectId}`}>
                  寄付ページを見る
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
