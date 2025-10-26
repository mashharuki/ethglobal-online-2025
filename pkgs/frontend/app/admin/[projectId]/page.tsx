import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { AdminConversionCard } from '@/components/organisms/AdminConversionCard';
import { SwapToPyusdCard } from '@/components/organisms/SwapToPyusdCard';
import { getProjectById, mockBalances, mockTransactions } from '@/mockdatas';
import { ExternalLink, TrendingUp, Users, Wallet } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  // モックデータ
  const project = getProjectById(projectId);
  const balances = mockBalances;
  const totalUsdValue = balances.reduce((sum, b) => sum + b.usdValue, 0);
  const transactions = mockTransactions;

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/donate/${projectId}`}>View Donation Page</Link>
            </Button>
          </div>
          <p className="text-muted-foreground text-lg">{project.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
              <Wallet className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                ${totalUsdValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All chains combined</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">234</div>
              <p className="text-xs text-muted-foreground mt-1">+12 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unique Donors</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">156</div>
              <p className="text-xs text-muted-foreground mt-1">+8 this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Balances */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Balance by Chain</CardTitle>
                <CardDescription>Real-time display of current balances across all chains</CardDescription>
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
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>History of donations, conversions, and withdrawals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={`${tx.from}-${tx.amount}-${tx.timestamp}`}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              tx.type === 'donation'
                                ? 'bg-accent/10 text-accent'
                                : tx.type === 'conversion'
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-chart-3/10 text-chart-3'
                            }`}
                          >
                            {tx.type === 'donation'
                              ? 'Donation'
                              : tx.type === 'conversion'
                                ? 'Conversion'
                                : 'Withdrawal'}
                          </span>
                          <code className="text-xs font-mono">{tx.from}</code>
                        </div>
                        <p className="text-sm font-semibold">{tx.amount}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.chain} • {tx.timestamp}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            tx.status === 'confirmed' || tx.status === 'completed'
                              ? 'bg-accent/10 text-accent'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {tx.status === 'confirmed'
                            ? '確認済み'
                            : tx.status === 'completed'
                              ? '完了'
                              : '処理中'}
                        </span>
                        <button
                          type="button"
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-1 justify-end"
                        >
                          詳細
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            <AdminConversionCard
              targetToken={project.targetToken}
              targetChain={project.targetChain}
              totalUsdValue={totalUsdValue}
            />

            {/* USDC to PYUSD Swap Card */}
            <SwapToPyusdCard />

            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Unified Address</p>
                  <code className="text-xs font-mono break-all bg-secondary p-2 rounded block">
                    {project.unifiedAddress}
                  </code>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Target Token</span>
                  <span className="font-semibold">{project.targetToken}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Target Chain</span>
                  <span className="font-semibold">{project.targetChain}</span>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90">
                  This project is protected by EOA-based ownership management.
                  Owner signature is required for conversion and withdrawal operations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
