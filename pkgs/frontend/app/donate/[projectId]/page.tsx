import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Coins, ExternalLink, TrendingUp, Zap, Shield } from 'lucide-react';
import { DonatePageClient } from '@/components/organisms/DonatePageClient';
import { getProjectById, mockSupportedTokens, mockRecentDonations } from '@/mockdatas';

export default async function DonatePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  // モックデータ
  const project = getProjectById(projectId);
  const supportedTokens = mockSupportedTokens;
  const recentDonations = mockRecentDonations;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.5_0.22_270/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 py-12 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">{project.name}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">{project.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Donation Interface */}
          <div className="lg:col-span-2 space-y-8">
            {/* 統一寄付アドレスカード - より目立つデザイン */}
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">統一寄付アドレス</CardTitle>
                    <CardDescription className="text-base">
                      このアドレスに任意のチェーン・トークンから送金してください
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <DonatePageClient unifiedAddress={project.unifiedAddress} />

                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 p-6 border-2 border-accent/20">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-accent" />
                      <p className="font-bold text-lg text-foreground">自動変換・集約</p>
                    </div>
                    <p className="text-sm text-foreground/80 mb-1">
                      <strong>集約先:</strong> {project.targetToken} on {project.targetChain}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      全ての寄付は自動的に{project.targetToken}に変換され、{project.targetChain}
                      に集約されます
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">サポートされるトークン</CardTitle>
                <CardDescription className="text-base">
                  以下のトークンで寄付できます
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {supportedTokens.map((token) => (
                    <div
                      key={token.symbol}
                      className="p-5 border-2 rounded-xl hover:border-primary/50 transition-all hover:shadow-lg bg-gradient-to-br from-card to-secondary/20"
                    >
                      <div className="mb-3">
                        <p className="text-2xl font-bold text-primary mb-1">{token.symbol}</p>
                        <p className="text-sm text-muted-foreground">{token.name}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {token.chains.map((chain) => (
                          <span
                            key={chain}
                            className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"
                          >
                            {chain}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  <div>
                    <CardTitle className="text-2xl">最近の寄付</CardTitle>
                    <CardDescription className="text-base">
                      リアルタイムで更新されます
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentDonations.map((donation) => (
                    <div
                      key={`${donation.donor}-${donation.amount}`}
                      className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-accent/50 transition-all bg-gradient-to-r from-card to-secondary/20"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="text-sm font-mono font-semibold">{donation.donor}</code>
                          <span className="text-xs font-semibold px-3 py-1 bg-accent/10 text-accent rounded-full border border-accent/20">
                            {donation.chain}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{donation.timestamp}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-accent mb-1">{donation.amount}</p>
                        <button
                          type="button"
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-medium"
                        >
                          Tx
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  寄付の流れ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">
                      1
                    </div>
                    <div>
                      <p className="font-bold text-base mb-1">トークンを選択</p>
                      <p className="text-sm text-muted-foreground">ETH、USDC、PYUSDなど</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-base mb-1">統一アドレスに送金</p>
                      <p className="text-sm text-muted-foreground">任意のチェーンから送金可能</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-chart-3 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">
                      3
                    </div>
                    <div>
                      <p className="font-bold text-base mb-1">自動変換・集約</p>
                      <p className="text-sm text-muted-foreground">指定トークンに自動変換</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="w-5 h-5 text-chart-3" />
                  技術スタック
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-sm font-medium text-muted-foreground">デプロイ方式</span>
                  <span className="font-bold text-primary">CREATE2</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-sm font-medium text-muted-foreground">ブリッジ</span>
                  <span className="font-bold text-accent">Avail Nexus</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-sm font-medium text-muted-foreground">開発環境</span>
                  <span className="font-bold text-chart-3">Hardhat V3</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/50 shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 gradient-primary opacity-95" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl text-white">管理者の方へ</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm mb-4 text-white/90 leading-relaxed">
                  寄付の管理や引き出しは管理者ダッシュボードから行えます
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full shadow-lg font-semibold"
                  asChild
                >
                  <Link href={`/admin/${projectId}`}>ダッシュボードを開く</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
