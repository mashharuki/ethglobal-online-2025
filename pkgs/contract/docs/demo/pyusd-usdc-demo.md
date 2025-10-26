# Feature 11: PYUSD→USDC 変換デモ（ハッカソン用）

目的: PayPal プライズ要件（PYUSD 使用）と Avail プライズ要件（Nexus SDK 使用）を満たすデモフローを提示。Hardhat v3 を使用。

## 構成
- コントラクト: `DonationPool`（寄付/残高/変換/出金）
- モックトークン: `PYUSDToken`(6dec), `USDCToken`(6dec)
- リスナー: `scripts/nexus-listener.ts`（`ConversionInitiated` を購読し SDK 呼び出し箇所の雛形）

## 準備
- Node 22 LTS / pnpm 10+
- ルートで `pnpm install`
- ローカルノード推奨: `pnpm hardhat node`

## 手順
1) デプロイ
```sh
pnpm --filter contract demo:deploy --network hardhat
```
出力されるアドレスを環境変数に設定:
```sh
export PYUSD_ADDRESS=0x...
export USDC_ADDRESS=0x...
export POOL_ADDRESS=0x...
export SINK_ADDRESS=0x...
```

2) PYUSD を寄付
```sh
pnpm --filter contract demo:donate-pyusd --network hardhat
```

3) Nexus リスナー起動（別ターミナル）
```sh
POOL_ADDRESS=$POOL_ADDRESS pnpm --filter contract demo:nexus-listener --network hardhat
```

4) 変換開始（PYUSD → Avail 側）
```sh
pnpm --filter contract demo:initiate --network hardhat
```
リスナーに `ConversionInitiated` が表示され、（本番では）Nexus SDK を呼び出します。

5) （オプション）USDC 受領後の引き出しをローカルで擬似
```sh
pnpm --filter contract demo:withdraw-usdc --network hardhat
```
デモでは USDC をプールへ寄付してから `withdrawFunds` を実行し、到着後の払い出しを模擬します。

## 画面キャプチャ候補
- デプロイ結果（アドレス一式）
- PYUSD 寄付のトランザクションログ（プール残高の増加）
- ConversionInitiated イベント（リスナーの標準出力）
- withdraw 実行後のプール USDC 残高減少

## 想定質問と要点
- Q: なぜモック PYUSD/USDC？
  - A: ローカル即時デモ用。実ネットでは公式コントラクトを参照。フロー/イベント/安全性は同等。
- Q: Avail 連携は？
  - A: `ConversionInitiated` を Nexus SDK が購読（`nexus-listener.ts` の `submitViaNexus` 部分に実装）。
- Q: セキュリティは？
  - A: onlyOwner, ReentrancyGuard, カスタムエラー/CEI を実装。ETH/トークン経路ともにバリデーション。
- Q: Hardhat v3 の意義？
  - A: 最新ツールチェーン（viem/ignition/verify）を活用。テスト/スクリプトの拡張性が高い。

