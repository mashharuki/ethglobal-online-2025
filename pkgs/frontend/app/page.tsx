import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { ArrowRight, Globe, Shield, Zap, Users, TrendingUp, Sparkles, Coins } from 'lucide-react';
import { mockProjects } from '@/mockdatas';
import { ProjectList } from '@/components/organisms/ProjectList';

/**
 * CrossDonate Homepage - Exact V0 Design Replica
 * @returns
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - V0 Style */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.5_0.22_270/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(0.6_0.24_190/0.15),transparent_50%)]" />

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">ETHGlobal Online 2025</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-balance leading-tight">
            Web3寄付の
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              断片化問題
            </span>
            を解決
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
            任意のチェーン・トークンから単一の統一アドレスに送金するだけで、
            自動的に指定トークン・チェーンに変換・集約される革新的なUX
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="gradient-primary text-white shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6"
              asChild
            >
              <Link href="/create">
                プロジェクトを作成
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 hover:bg-secondary bg-transparent"
              asChild
            >
              <Link href="#projects">プロジェクトを見る</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-effect rounded-2xl p-6 border shadow-lg">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                $2.4M+
              </div>
              <div className="text-sm text-muted-foreground font-medium">総寄付額</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 border shadow-lg">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                1,200+
              </div>
              <div className="text-sm text-muted-foreground font-medium">アクティブ寄付者</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 border shadow-lg">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                45+
              </div>
              <div className="text-sm text-muted-foreground font-medium">プロジェクト数</div>
            </div>
          </div>
        </div>
      </section>

      {/* Nexus SDK Demo Section - Enhanced */}
      {/* <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Nexus SDK デモ
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Nexus SDKを使用したクロスチェーン機能を体験してください。
                統一されたアドレスで複数のブロックチェーンから寄付を受け付けます。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl gradient-card glass-effect">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">統一残高表示</h3>
                  <ViewUnifiedBalance />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl gradient-card glass-effect">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">クロスチェーン操作</h3>
                  <Nexus />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section> */}

      {/* Features Section - V0 Style */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">主な機能</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              CREATE2とAvail Nexusで実現する次世代の寄付体験
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:glow-primary transition-all">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl">統一アドレス</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  CREATE2により全チェーンで同一アドレスを実現。寄付者は1つのアドレスだけ覚えればOK。
                  複雑なチェーン選択は不要です。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all hover:shadow-xl group">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-chart-3 rounded-2xl flex items-center justify-center shadow-lg group-hover:glow-accent transition-all">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl">自動変換</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Avail Nexus SDKで任意のトークンを指定トークンに自動スワップ・ブリッジ。
                  手動での変換作業は一切不要です。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-chart-3/50 transition-all hover:shadow-xl group">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-chart-3 to-chart-4 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-chart-3/50 transition-all">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl">シンプルセキュリティ</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  EOAベースの所有権管理で、複雑な分散署名なしに安全性を確保。
                  シンプルで信頼性の高いアーキテクチャ。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-chart-4/50 transition-all hover:shadow-xl group">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-chart-4 to-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-chart-4/50 transition-all">
                  <Coins className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl">マルチトークン対応</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  ETH、USDC、PYUSDなど複数トークンに対応。寄付者の選択肢が広がり、
                  より多くの支援を集められます。
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section - V0 Style */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-5xl font-bold mb-3">アクティブなプロジェクト</h2>
              <p className="text-xl text-muted-foreground">今すぐ支援できるプロジェクト</p>
            </div>
            <Button size="lg" className="gradient-primary text-white shadow-lg" asChild>
              <Link href="/create">新規作成</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProjects.map((project) => (
              <Card
                key={project.id}
                className="border-2 hover:border-primary/50 hover:shadow-2xl transition-all group overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-primary via-accent to-chart-3" />
                <CardHeader className="space-y-3">
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="text-base">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">総寄付額</span>
                      </div>
                      <span className="font-bold text-lg text-primary">
                        {project.totalDonations}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-muted-foreground">寄付者数</span>
                      </div>
                      <span className="font-bold text-lg text-accent">{project.donorCount}人</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.chains?.map((chain) => (
                      <span
                        key={chain}
                        className="text-xs font-semibold px-3 py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 rounded-full"
                      >
                        {chain}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      size="lg"
                      className="flex-1 gradient-primary text-white shadow-lg"
                      asChild
                    >
                      <Link href={`/donate/${project.id}`}>寄付する</Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 border-2 bg-transparent"
                      asChild
                    >
                      <Link href={`/admin/${project.id}`}>管理</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 作成済みプロジェクト一覧 */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <ProjectList />
        </div>
      </section>
    </div>
  );
}
