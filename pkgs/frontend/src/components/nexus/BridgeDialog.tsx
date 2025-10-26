"use client";

import { Button } from "@/components/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { useNexusSDK } from "@/hooks/useNexusSDK";
import type { SUPPORTED_CHAINS_IDS } from "@avail-project/nexus-core";
import { useCallback, useEffect, useId, useState } from "react";
import { useAccount } from "wagmi";

interface BridgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// メインネットとテストネットで利用可能なトークンを分ける
const MAINNET_TOKENS = ["ETH", "USDC", "USDT"] as const;
const TESTNET_TOKENS = ["ETH", "USDC", "USDT"] as const;

// メインネットチェーン
const MAINNET_CHAINS = [
  { id: 1, name: "Ethereum" },
  { id: 10, name: "Optimism" },
  { id: 137, name: "Polygon" },
  { id: 42161, name: "Arbitrum" },
  { id: 43114, name: "Avalanche" },
  { id: 8453, name: "Base" },
  { id: 534352, name: "Scroll" },
  { id: 56, name: "BNB Chain" },
] as const;

// テストネットチェーン（Nexus SDK公式サポートチェーン）
const TESTNET_CHAINS = [
  { id: 11155111, name: "Sepolia" },
  { id: 84532, name: "Base Sepolia" },
  { id: 421614, name: "Arbitrum Sepolia" },
  { id: 11155420, name: "Optimism Sepolia" },
  { id: 80002, name: "Polygon Amoy" },
  { id: 10143, name: "Monad Testnet" },
] as const;

export default function BridgeDialog({ isOpen, onOpenChange }: BridgeDialogProps) {
  const { address, isConnected } = useAccount();
  const { nexusSDK, isInitialized, initializeSDK } = useNexusSDK();

  // ユニークなIDを生成
  const tokenId = useId();
  const amountId = useId();
  const targetChainId = useId();
  const networkModeId = useId();

  const [token, setToken] = useState<"ETH" | "USDC" | "USDT">("ETH");
  const [amount, setAmount] = useState("");
  const [targetChain, setTargetChain] = useState<SUPPORTED_CHAINS_IDS>(137);
  const [networkMode, setNetworkMode] = useState<"mainnet" | "testnet">("mainnet");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // 現在のネットワークモードに応じてチェーンリストとトークンリストを取得
  const currentChains = networkMode === "mainnet" ? MAINNET_CHAINS : TESTNET_CHAINS;
  const currentTokens = networkMode === "mainnet" ? MAINNET_TOKENS : TESTNET_TOKENS;

  // SDK初期化処理
  const handleInitializeSDK = useCallback(async () => {
    if (!isConnected || !address) {
      setError("ウォレットが接続されていません。");
      return;
    }

    if (isInitializing) {
      console.log("BridgeDialog: 既に初期化中です。");
      return;
    }

    setIsInitializing(true);
    setError(null);
    setSuccess(null);

    try {
      await initializeSDK();
      setSuccess("Nexus SDKが正常に初期化されました。");
    } catch (err) {
      console.error("SDK initialization error:", err);
      setError(`SDK初期化に失敗しました: ${err instanceof Error ? err.message : "不明なエラー"}`);
    } finally {
      setIsInitializing(false);
    }
  }, [isConnected, address, isInitializing, initializeSDK]);

  // ダイアログが開かれた時のみSDK初期化を自動実行
  useEffect(() => {
    if (isOpen && isConnected && !isInitialized && !isInitializing) {
      handleInitializeSDK();
    }
  }, [isOpen, isConnected, isInitialized, isInitializing, handleInitializeSDK]);

  const handleBridge = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("有効な数量を入力してください。");
      return;
    }

    if (!isConnected || !address) {
      setError("ウォレットが接続されていません。");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // SDKが初期化されていない場合は自動初期化を実行
      if (!isInitialized) {
        setSuccess("Nexus SDKを初期化中...");
        try {
          await initializeSDK();
          setSuccess("Nexus SDKの初期化が完了しました。ブリッジを開始します...");

          // 初期化完了後、少し待機してからブリッジ処理を続行
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (initError) {
          console.error("SDK初期化エラー:", initError);
          setError(
            `SDK初期化に失敗しました: ${initError instanceof Error ? initError.message : "不明なエラー"}`
          );
          return;
        }
      }

      // ブリッジを実行
      const result = await nexusSDK.bridge({
        token,
        amount: Number.parseFloat(amount),
        chainId: targetChain,
      });

      if (result.success) {
        setSuccess(
          `ブリッジが成功しました！${result.explorerUrl ? `トランザクション: ${result.explorerUrl}` : ""}`
        );
        // 成功後、フォームをリセット
        setAmount("");
      } else {
        setError(`ブリッジが失敗しました: ${result.error || "不明なエラー"}`);
      }
    } catch (err) {
      console.error("Bridge error:", err);
      setError(
        `ブリッジ中にエラーが発生しました: ${err instanceof Error ? err.message : "不明なエラー"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setError(null);
    setSuccess(null);
    setAmount("");
  };

  // ネットワークモードが変更された時にデフォルトチェーンとトークンを設定
  const handleNetworkModeChange = (mode: "mainnet" | "testnet") => {
    setNetworkMode(mode);
    // デフォルトチェーンを設定
    const defaultChain = mode === "mainnet" ? 137 : 11155111; // Polygon or Sepolia
    setTargetChain(defaultChain as SUPPORTED_CHAINS_IDS);
    // テストネットではETHのみ利用可能
    if (mode === "testnet") {
      setToken("ETH");
    }
    // エラーメッセージのみクリア（成功メッセージは保持）
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[95vh] overflow-y-auto p-6 md:p-8">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            トークンブリッジ
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-gray-600">
            Nexus SDKを使用してトークンを異なるチェーン間でブリッジします。
          </DialogDescription>

          {/* 成功メッセージ - より目立つデザイン */}
          {success && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {/* ネットワークモード選択 - 改善されたデザイン */}
          <div className="space-y-3">
            <Label htmlFor={networkModeId} className="text-lg font-semibold text-gray-700">
              ネットワーク
            </Label>
            <div className="flex gap-3">
              <Button
                variant={networkMode === "mainnet" ? "default" : "outline"}
                onClick={() => handleNetworkModeChange("mainnet")}
                className={`flex-1 py-3 transition-all duration-200 ${
                  networkMode === "mainnet"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                Mainnet
              </Button>
              <Button
                variant={networkMode === "testnet" ? "default" : "outline"}
                onClick={() => handleNetworkModeChange("testnet")}
                className={`flex-1 py-3 transition-all duration-200 ${
                  networkMode === "testnet"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                Testnet
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 左カラム - トークンと数量 */}
            <div className="space-y-6">
              {/* トークン選択 */}
              <div className="space-y-3">
                <Label htmlFor={tokenId} className="text-lg font-semibold text-gray-700">
                  ブリッジトークン
                </Label>
                <select
                  id={tokenId}
                  value={token}
                  onChange={(e) => setToken(e.target.value as "ETH" | "USDC" | "USDT")}
                  className="w-full h-12 p-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {currentTokens.map((tokenOption) => (
                    <option key={tokenOption} value={tokenOption}>
                      {tokenOption}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500">
                  Base SepoliaからArbitrum Sepoliaにブリッジするトークンを選択
                </p>
              </div>

              {/* 数量入力 */}
              <div className="space-y-3">
                <Label htmlFor={amountId} className="text-lg font-semibold text-gray-700">
                  数量
                </Label>
                <Input
                  id={amountId}
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 text-lg"
                  step="0.000001"
                  min="0"
                />
                <p className="text-sm text-gray-500">ブリッジする{token}の数量を入力してください</p>
              </div>
            </div>

            {/* 右カラム - チェーン選択 */}
            <div className="space-y-6">
              {/* 送信元チェーン */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-700">送信元チェーン</Label>
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-center text-gray-600 font-medium">Base Sepolia (84532)</p>
                  <p className="text-center text-sm text-gray-500 mt-1">
                    注意: テスト前にBase SepoliaでUSDCを取得し、Arbitrum
                    SepoliaでETHを取得してください
                  </p>
                </div>
              </div>

              {/* 送信先チェーン */}
              <div className="space-y-3">
                <Label htmlFor={targetChainId} className="text-lg font-semibold text-gray-700">
                  送信先チェーン
                </Label>
                <select
                  id={targetChainId}
                  value={targetChain.toString()}
                  onChange={(e) =>
                    setTargetChain(Number.parseInt(e.target.value, 10) as SUPPORTED_CHAINS_IDS)
                  }
                  className="w-full h-12 p-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {currentChains.map((chain) => (
                    <option key={chain.id} value={chain.id.toString()}>
                      {chain.name} ({chain.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 利用可能な関数の説明 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              🌉 Base Sepolia → Arbitrium Sepolia ブリッジ & 実行テスト
            </h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p>
                <strong>テスト内容:</strong> Base SepoliaのUSDCをArbitrium
                Sepoliaにブリッジ後、DonationPoolコントラクトでdonateまたはswapUsdcToPyusdを実行
              </p>
              <div className="mt-3">
                <p className="font-medium">利用可能な関数:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <strong>donate:</strong> トークンを寄付（USDCをDonationPoolに寄付）
                  </li>
                  <li>
                    <strong>swapUsdcToPyusd:</strong> USDCをPYUSDにスワップ
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 必要な設定情報 */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">必要な設定:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">
                  DonationPoolコントラクトアドレス (Arbitrium Sepolia)
                </p>
                <p className="font-mono text-xs bg-white p-2 rounded border break-all">
                  0x025755dfebe6eEF0a58cEa71ba3A417f4175CAa3
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">
                  USDCコントラクトアドレス (Arbitrium Sepolia)
                </p>
                <p className="font-mono text-xs bg-white p-2 rounded border break-all">
                  0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">
                  PYUSDコントラクトアドレス (Arbitrium Sepolia)
                </p>
                <p className="font-mono text-xs bg-white p-2 rounded border break-all">
                  0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">関数名</p>
                <p className="bg-white p-2 rounded border">donate - トークンを寄付</p>
              </div>
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {!isInitialized && isConnected && (
              <Button
                onClick={handleInitializeSDK}
                disabled={isInitializing}
                className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-lg transition-all duration-200"
              >
                {isInitializing
                  ? "ブリッジ中..."
                  : "✅ USDC用のNexus SDK初期化完了！ テストを開始できます"}
              </Button>
            )}

            <Button
              onClick={handleBridge}
              disabled={isLoading || !isConnected || !amount || Number.parseFloat(amount) <= 0}
              className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg transition-all duration-200 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ブリッジ中...
                </div>
              ) : (
                "ブリッジ実行"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleClose}
              className="h-12 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold text-lg transition-all duration-200"
            >
              閉じる
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
