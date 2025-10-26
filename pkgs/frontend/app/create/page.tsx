"use client";

import { Button } from "@/components/atoms/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { Coins, Globe, Loader2, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

export default function CreateProjectPage() {
  const router = useRouter();
  const nameId = useId();
  const descriptionId = useId();
  const targetTokenId = useId();
  const targetChainId = useId();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetToken: "USDC",
    targetChain: "Arbitrum Sepolia",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    // モック: 実際にはスマートコントラクトをデプロイ
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // モックプロジェクトIDを生成
    const projectId = `project-${Date.now()}`;
    router.push(`/admin/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.5_0.22_270/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 py-16 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">CREATE2で統一アドレスを生成</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
            新しいプロジェクトを作成
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            統一寄付アドレスを持つプロジェクトを作成し、複数チェーンから寄付を受け取りましょう
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-2 shadow-xl">
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl">プロジェクト情報</CardTitle>
                <CardDescription className="text-base">
                  プロジェクトの基本情報と集約先の設定を行います
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor={nameId} className="text-base font-semibold">
                      プロジェクト名 *
                    </Label>
                    <Input
                      id={nameId}
                      placeholder="例: オープンソース開発支援"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="text-base h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor={descriptionId} className="text-base font-semibold">
                      説明
                    </Label>
                    <Textarea
                      id={descriptionId}
                      placeholder="プロジェクトの目的や活動内容を説明してください"
                      rows={5}
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="text-base"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor={targetTokenId} className="text-base font-semibold">
                        集約先トークン *
                      </Label>
                      <select
                        id={targetTokenId}
                        className="w-full px-4 py-3 border-2 border-input rounded-xl bg-background text-base font-medium hover:border-primary/50 transition-colors"
                        value={formData.targetToken}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setFormData({ ...formData, targetToken: e.target.value })
                        }
                      >
                        <option value="USDC">USDC</option>
                        <option value="PYUSD">PYUSD</option>
                        <option value="ETH">ETH</option>
                      </select>
                      <p className="text-sm text-muted-foreground">
                        全ての寄付がこのトークンに変換されます
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor={targetChainId} className="text-base font-semibold">
                        集約先チェーン *
                      </Label>
                      <select
                        id={targetChainId}
                        className="w-full px-4 py-3 border-2 border-input rounded-xl bg-background text-base font-medium hover:border-primary/50 transition-colors"
                        value={formData.targetChain}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setFormData({ ...formData, targetChain: e.target.value })
                        }
                      >
                        <option value="Arbitrum Sepolia">Arbitrum Sepolia</option>
                        <option value="Sepolia">Sepolia</option>
                      </select>
                      <p className="text-sm text-muted-foreground">寄付が集約されるチェーン</p>
                    </div>
                  </div>

                  <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-base">サポートされるチェーン</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-semibold px-4 py-2 bg-accent/10 text-accent rounded-full border border-accent/20">
                          Sepolia
                        </span>
                        <span className="text-sm font-semibold px-4 py-2 bg-accent/10 text-accent rounded-full border border-accent/20">
                          Arbitrum Sepolia
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Coins className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-base">サポートされるトークン</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-semibold px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                          ETH
                        </span>
                        <span className="text-sm font-semibold px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                          USDC
                        </span>
                        <span className="text-sm font-semibold px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                          PYUSD
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 gradient-primary text-white shadow-lg text-base"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          作成中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          プロジェクトを作成
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="border-2 bg-transparent"
                      asChild
                    >
                      <Link href="/">キャンセル</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-3 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">CREATE2による統一アドレス</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  プロジェクト作成時に、CREATE2を使用して全てのサポートチェーンで同一のアドレスが生成されます。
                  寄付者は1つのアドレスだけを覚えれば、どのチェーンからでも寄付できます。
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">作成後の流れ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <p className="text-sm text-muted-foreground">統一アドレスが自動生成されます</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <p className="text-sm text-muted-foreground">寄付ページで共有できます</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <p className="text-sm text-muted-foreground">管理ダッシュボードで管理</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
