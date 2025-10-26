"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { useNexusSDK } from "@/hooks/useNexusSDK";
import { useWeb3Context } from "@/providers/Web3Provider";
import type {
  BridgeAndExecuteParams,
  BridgeAndExecuteResult,
  BridgeAndExecuteSimulationResult,
} from "@avail-project/nexus-core";
import { useCallback, useEffect, useId, useState } from "react";
import { useAccount } from "wagmi";

interface BridgeAndExecuteTestProps {
  className?: string;
  selectedToken?: "USDT" | "USDC" | null;
  defaultFunction?: "donate" | "swapUsdcToPyusd";
}

export default function BridgeAndExecuteTest({
  className,
  selectedToken,
  defaultFunction = "donate",
}: BridgeAndExecuteTestProps) {
  const { isConnected, address } = useAccount();
  const { nexusSDK, isInitialized, initializeSDK } = useNexusSDK();
  const { network } = useWeb3Context();
  const id = useId();

  // フォームの状態
  const [formData, setFormData] = useState({
    token: selectedToken || "USDC",
    amount: "1",
    toChainId: "421614", // Arbitrum Sepolia
    sourceChains: "84532", // Base Sepolia
    contractAddress: "0x025755dfebe6eEF0a58cEa71ba3A417f4175CAa3", // DonationPoolコントラクトアドレス（Arbitrum Sepolia）
    functionName: defaultFunction,
    recipient: "",
    usdcAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // USDCコントラクトアドレス（Arbitrum Sepolia）
    pyusdAddress: "0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1", // PYUSDコントラクトアドレス（Arbitrum Sepolia）
  });

  // 実行状態
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BridgeAndExecuteResult | null>(null);
  const [simulation, setSimulation] = useState<BridgeAndExecuteSimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // ネットワーク名からチェーンIDを取得
  const getChainIdFromNetwork = useCallback((networkName: string): number | null => {
    const networkMap: { [key: string]: number } = {
      ethereum: 1,
      base: 8453,
      "base-sepolia": 84532,
      polygon: 137,
      arbitrum: 42161,
      "arbitrum-sepolia": 421614,
      optimism: 10,
      avalanche: 43114,
    };
    return networkMap[networkName.toLowerCase()] || null;
  }, []);

  // 現在のネットワークに基づいてデフォルト値を設定
  useEffect(() => {
    if (network) {
      const currentChainId = getChainIdFromNetwork(network);
      if (currentChainId) {
        setFormData((prev) => ({
          ...prev,
          sourceChains: currentChainId.toString(),
        }));
      }
    }
  }, [network, getChainIdFromNetwork]);

  // selectedTokenが変更された時にフォームを更新
  useEffect(() => {
    if (selectedToken) {
      setFormData((prev) => ({
        ...prev,
        token: selectedToken,
      }));
    }
  }, [selectedToken]);

  // コンポーネント表示時にSDK初期化を自動実行
  useEffect(() => {
    if (isConnected && !isInitialized && !isInitializing) {
      console.log("Bridge & Execute: SDK初期化を開始します...");
      setIsInitializing(true);
      initializeSDK().finally(() => {
        setIsInitializing(false);
      });
    }
  }, [isConnected, isInitialized, isInitializing, initializeSDK]);

  // フォームの更新
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // シミュレーション実行
  const handleSimulate = async () => {
    if (!isInitialized || !nexusSDK) {
      setError("Nexus SDKが初期化されていません");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSimulation(null);

    try {
      const params: BridgeAndExecuteParams = {
        token: formData.token as "USDC" | "USDT" | "ETH",
        amount: formData.amount,
        toChainId: Number.parseInt(formData.toChainId, 10) as
          | 1
          | 8453
          | 137
          | 42161
          | 10
          | 43114
          | 421614
          | 84532,
        // sourceChains: formData.sourceChains.split(',').map((id) => parseInt(id.trim(), 10)),
        recipient: (formData.recipient || address) as `0x${string}`,
        execute: {
          contractAddress: formData.contractAddress as `0x${string}`,
          contractAbi: [
            {
              inputs: [
                { internalType: "address", name: "token", type: "address" },
                { internalType: "uint256", name: "amount", type: "uint256" },
              ],
              name: "donate",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                { internalType: "address", name: "usdc", type: "address" },
                { internalType: "address", name: "pyusd", type: "address" },
                { internalType: "uint256", name: "amount", type: "uint256" },
                { internalType: "address", name: "to", type: "address" },
              ],
              name: "swapUsdcToPyusd",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          functionName: formData.functionName,
          buildFunctionParams: (_token, amount, _chainId, _userAddress) => {
            const decimals = 6; // USDC decimals
            const amountWei = BigInt(Number.parseFloat(amount) * 10 ** decimals);
            if (formData.functionName === "donate") {
              return {
                functionParams: [formData.usdcAddress as `0x${string}`, amountWei],
              };
            } else {
              return {
                functionParams: [
                  formData.usdcAddress as `0x${string}`,
                  formData.pyusdAddress as `0x${string}`,
                  amountWei,
                  _userAddress,
                ],
              };
            }
          },
          tokenApproval: {
            token: formData.token as "USDC" | "USDT" | "ETH",
            amount: formData.amount,
          },
        },
        waitForReceipt: false,
      };

      const simulationResult = await nexusSDK.simulateBridgeAndExecute(params);
      setSimulation(simulationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "シミュレーションに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 実際の実行
  const handleExecute = async () => {
    if (!isInitialized || !nexusSDK) {
      setError("Nexus SDKが初期化されていません");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const params: BridgeAndExecuteParams = {
        token: formData.token as "USDC" | "USDT" | "ETH",
        amount: formData.amount,
        toChainId: Number.parseInt(formData.toChainId, 10) as
          | 1
          | 8453
          | 137
          | 42161
          | 10
          | 43114
          | 421614
          | 84532,
        // sourceChains: formData.sourceChains.split(',').map((id) => parseInt(id.trim(), 10)),
        recipient: (formData.recipient || address) as `0x${string}`,
        execute: {
          contractAddress: formData.contractAddress as `0x${string}`,
          contractAbi: [
            {
              inputs: [
                { internalType: "address", name: "token", type: "address" },
                { internalType: "uint256", name: "amount", type: "uint256" },
              ],
              name: "donate",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                { internalType: "address", name: "usdc", type: "address" },
                { internalType: "address", name: "pyusd", type: "address" },
                { internalType: "uint256", name: "amount", type: "uint256" },
                { internalType: "address", name: "to", type: "address" },
              ],
              name: "swapUsdcToPyusd",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          functionName: formData.functionName,
          buildFunctionParams: (_token, amount, _chainId, _userAddress) => {
            const decimals = 6; // USDC decimals
            const amountWei = BigInt(Number.parseFloat(amount) * 10 ** decimals);
            if (formData.functionName === "donate") {
              return {
                functionParams: [formData.usdcAddress as `0x${string}`, amountWei],
              };
            } else {
              return {
                functionParams: [
                  formData.usdcAddress as `0x${string}`,
                  formData.pyusdAddress as `0x${string}`,
                  amountWei,
                  _userAddress,
                ],
              };
            }
          },
          tokenApproval: {
            token: formData.token as "USDC" | "USDT" | "ETH",
            amount: formData.amount,
          },
        },
        waitForReceipt: true,
        requiredConfirmations: 1,
      };

      const result = await nexusSDK.bridgeAndExecute(params);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "実行に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {!isConnected && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">ウォレットを接続してください</p>
          </div>
        )}

        {(!isInitialized || isInitializing) && isConnected && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              {selectedToken
                ? `${selectedToken}用のNexus SDKを初期化中...`
                : "Nexus SDKを初期化中..."}{" "}
              しばらくお待ちください
            </p>
            <div className="mt-2">
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {isInitialized && isConnected && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              ✅{" "}
              {selectedToken
                ? `${selectedToken}用のNexus SDK初期化完了！`
                : "Nexus SDK初期化完了！"}{" "}
              テストを開始できます
            </p>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mb-6">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            🔄 Base Sepolia → Arbitrum Sepolia ブリッジ & 実行テスト
          </h3>
          <div className="text-sm text-blue-700 space-y-3">
            <p>
              <strong>テスト内容:</strong> Base SepoliaのUSDCをArbitrum
              Sepoliaにブリッジ後、DonationPoolコントラクトでdonateまたはswapUsdcToPyusdを実行
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold mb-2">利用可能な関数:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>donate:</strong> トークンを寄付（USDCをDonationPoolに寄付）
                  </li>
                  <li>
                    <strong>swapUsdcToPyusd:</strong> USDCをPYUSDにスワップ
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">必要な設定:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>DonationPoolコントラクトアドレス（Arbitrum Sepolia）</li>
                  <li>USDCコントラクトアドレス（Arbitrum Sepolia）: デフォルト設定済み</li>
                  <li>PYUSDコントラクトアドレス（Arbitrum Sepolia）: デフォルト設定済み</li>
                  <li>送信元チェーン: Base Sepolia (84532)</li>
                  <li>宛先チェーン: Arbitrum Sepolia (421614)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm font-medium">
                <strong>注意:</strong> テスト前にBase SepoliaでUSDCを取得し、Arbitrum
                SepoliaでETHを取得してください。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* 基本設定セクション */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">基本設定</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor={`${id}-token`} className="text-sm font-medium text-gray-700">
                  ブリッジトークン
                </Label>
                <select
                  id={`${id}-token`}
                  value={formData.token}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleInputChange("token", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="USDC">USDC (USD Coin)</option>
                  <option value="USDT">USDT (Tether USD)</option>
                  <option value="WETH">WETH (Wrapped Ether)</option>
                  <option value="ETH">ETH (Ethereum)</option>
                </select>
                <p className="text-xs text-gray-500">
                  Base SepoliaからArbitrum Sepoliaにブリッジするトークンを選択
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor={`${id}-amount`} className="text-sm font-medium text-gray-700">
                  数量
                </Label>
                <Input
                  id={`${id}-amount`}
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="1"
                  className="p-3 text-lg"
                  step="0.000001"
                  min="0"
                />
                <p className="text-xs text-gray-500">ブリッジする{formData.token}の数量</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor={`${id}-functionName`} className="text-sm font-medium text-gray-700">
                  関数名
                </Label>
                <select
                  id={`${id}-functionName`}
                  value={formData.functionName}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleInputChange("functionName", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="donate">donate - トークンを寄付</option>
                  <option value="swapUsdcToPyusd">swapUsdcToPyusd - USDCをPYUSDにスワップ</option>
                </select>
                <p className="text-xs text-gray-500">DonationPoolコントラクトで実行したい関数名</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor={`${id}-recipient`} className="text-sm font-medium text-gray-700">
                  受信者アドレス（空の場合は現在のアドレス）
                </Label>
                <Input
                  id={`${id}-recipient`}
                  value={formData.recipient}
                  onChange={(e) => handleInputChange("recipient", e.target.value)}
                  placeholder={address || "0x..."}
                  className="p-3 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* チェーン設定セクション */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">チェーン設定</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor={`${id}-sourceChains`} className="text-sm font-medium text-gray-700">
                  送信元チェーンID
                </Label>
                <Input
                  id={`${id}-sourceChains`}
                  value={formData.sourceChains}
                  onChange={(e) => handleInputChange("sourceChains", e.target.value)}
                  placeholder="84532 (Base Sepolia)"
                  className="p-3"
                />
                <p className="text-xs text-gray-500">Base Sepolia (84532)</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor={`${id}-toChainId`} className="text-sm font-medium text-gray-700">
                  宛先チェーンID
                </Label>
                <Input
                  id={`${id}-toChainId`}
                  value={formData.toChainId}
                  onChange={(e) => handleInputChange("toChainId", e.target.value)}
                  placeholder="421614 (Arbitrum Sepolia)"
                  className="p-3"
                />
                <p className="text-xs text-gray-500">Arbitrum Sepolia (421614)</p>
              </div>
            </div>
          </div>

          {/* コントラクトアドレス設定セクション */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">コントラクトアドレス設定</h4>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor={`${id}-contractAddress`}
                  className="text-sm font-medium text-gray-700"
                >
                  DonationPoolコントラクトアドレス（Arbitrum Sepolia）
                </Label>
                <Input
                  id={`${id}-contractAddress`}
                  value={formData.contractAddress}
                  onChange={(e) => handleInputChange("contractAddress", e.target.value)}
                  placeholder="0x..."
                  className="p-3 font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Arbitrum SepoliaにデプロイされたDonationPoolコントラクトのアドレス
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor={`${id}-usdcAddress`}
                    className="text-sm font-medium text-gray-700"
                  >
                    USDCコントラクトアドレス（Arbitrum Sepolia）
                  </Label>
                  <Input
                    id={`${id}-usdcAddress`}
                    value={formData.usdcAddress}
                    onChange={(e) => handleInputChange("usdcAddress", e.target.value)}
                    placeholder="0x..."
                    className="p-3 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Arbitrum SepoliaのUSDCコントラクトアドレス
                  </p>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor={`${id}-pyusdAddress`}
                    className="text-sm font-medium text-gray-700"
                  >
                    PYUSDコントラクトアドレス（Arbitrum Sepolia）
                  </Label>
                  <Input
                    id={`${id}-pyusdAddress`}
                    value={formData.pyusdAddress}
                    onChange={(e) => handleInputChange("pyusdAddress", e.target.value)}
                    placeholder="0x..."
                    className="p-3 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Arbitrum SepoliaのPYUSDコントラクトアドレス
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">アクション</h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSimulate}
              disabled={!isConnected || !isInitialized || isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  シミュレーション中...
                </div>
              ) : (
                "シミュレーション実行"
              )}
            </Button>
            <Button
              onClick={handleExecute}
              disabled={!isConnected || !isInitialized || isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  実行中...
                </div>
              ) : (
                "実際に実行"
              )}
            </Button>
          </div>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <h3 className="font-semibold text-red-800">エラーが発生しました</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* シミュレーション結果 */}
        {simulation && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-blue-800">シミュレーション結果</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-700">成功:</span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      simulation.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {simulation.success ? "はい" : "いいえ"}
                  </span>
                </div>
                {simulation.totalEstimatedCost && (
                  <div>
                    <span className="font-medium text-blue-700">推定コスト:</span>
                    <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-x-auto">
                      {JSON.stringify(simulation.totalEstimatedCost, null, 2)}
                    </pre>
                  </div>
                )}
                {simulation.metadata?.approvalRequired && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-700">承認が必要:</span>
                    <span className="px-2 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800">
                      はい
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {simulation.metadata?.bridgeReceiveAmount && (
                  <div>
                    <span className="font-medium text-blue-700">ブリッジ受信数量:</span>
                    <p className="mt-1 p-2 bg-white rounded border font-mono text-sm">
                      {simulation.metadata.bridgeReceiveAmount}
                    </p>
                  </div>
                )}
                {simulation.steps && simulation.steps.length > 0 && (
                  <div>
                    <span className="font-medium text-blue-700">ステップ:</span>
                    <div className="mt-1 space-y-1">
                      {simulation.steps.map((step, index) => (
                        <div
                          key={`step-${index}-${JSON.stringify(step)}`}
                          className="p-2 bg-white rounded border text-xs"
                        >
                          <span className="text-blue-600 font-medium">ステップ {index + 1}:</span>
                          <pre className="mt-1 overflow-x-auto">
                            {JSON.stringify(step, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 実行結果 */}
        {result && (
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold text-green-800">実行結果</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-green-700">成功:</span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.success ? "はい" : "いいえ"}
                  </span>
                </div>
                {result.bridgeSkipped && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-700">ブリッジスキップ:</span>
                    <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                      はい（十分な資金があるため）
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {result.bridgeTransactionHash && (
                  <div>
                    <span className="font-medium text-green-700">
                      ブリッジトランザクションハッシュ:
                    </span>
                    <p className="mt-1 p-2 bg-white rounded border font-mono text-xs break-all">
                      {result.bridgeTransactionHash}
                    </p>
                  </div>
                )}
                {result.executeTransactionHash && (
                  <div>
                    <span className="font-medium text-green-700">
                      実行トランザクションハッシュ:
                    </span>
                    <p className="mt-1 p-2 bg-white rounded border font-mono text-xs break-all">
                      {result.executeTransactionHash}
                    </p>
                  </div>
                )}
                {result.approvalTransactionHash && (
                  <div>
                    <span className="font-medium text-green-700">
                      承認トランザクションハッシュ:
                    </span>
                    <p className="mt-1 p-2 bg-white rounded border font-mono text-xs break-all">
                      {result.approvalTransactionHash}
                    </p>
                  </div>
                )}
                {result.error && (
                  <div className="p-3 bg-red-100 border border-red-200 rounded">
                    <span className="font-medium text-red-700">エラー:</span>
                    <p className="mt-1 text-red-600">{result.error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
