# DonationPool Deployment Guide

DonationPoolコントラクトのデプロイメントガイドです。

## 利用可能なデプロイメントモジュール

### 1. DonationPool.ts (mainnet/testnet共通)
引数でtargetTokenを指定する汎用デプロイメントスクリプト。

### 2. ExampleToken.ts (テスト用)
テストネット用のERC20トークンをデプロイ。

## デプロイメント手順

### テストネット環境での完全セットアップ

```bash
# 1. テスト用ERC20トークンをデプロイ
pnpm deploy:ExampleToken --network sepolia

# 2. デプロイされたExampleTokenのアドレスをコピー（例: 0x1234...）

# 3. ExampleTokenをターゲットとしてDonationPoolをデプロイ
pnpm deploy:DonationPool --network sepolia \
  --parameters '{"DonationPoolModule":{"targetToken":"0x1234...","initialSupportedTokens":["0x0000000000000000000000000000000000000000","0x1234..."]}}'

# 4. Arbitrum SepoliaでPYUSDをターゲットとしてDonationPoolをデプロイ
pnpm deploy:DonationPool --network arbitrumSepolia \
  --parameters '{"DonationPoolModule":{"targetToken":"0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1","initialSupportedTokens":["0x0000000000000000000000000000000000000000","0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1", "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"]}}'
```

### Mainnet環境でのPYUSDセットアップ

```bash
# PYUSD（PayPal USD）をターゲットとしてDonationPoolをデプロイ
pnpm deploy:DonationPool --network mainnet \
  --parameters '{"DonationPoolModule":{"targetToken":"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8","initialSupportedTokens":["0x0000000000000000000000000000000000000000","0x6c3ea9036406852006290770BEdFcAbA0e23A0e8"]}}'
```

## パラメータ詳細

### 必須パラメータ
- `targetToken`: 変換先トークンアドレス（PYUSDまたはExampleTokenなど）

### オプションパラメータ
- `initialOwner`: コントラクトオーナー（デフォルト: デプロイヤー）
- `initialSupportedTokens`: 初期サポートトークン配列（デフォルト: ETHのみ）

## 実用的な使用例

### 1. ローカル開発環境

```bash
# ローカルノード起動
pnpm hardhat node

# 別ターミナルで
# 1. ExampleTokenをデプロイ
pnpm deploy:ExampleToken --network localhost

# 2. 出力されたアドレスを使ってDonationPoolをデプロイ
pnpm deploy:DonationPool --network localhost \
  --parameters '{"DonationPoolModule":{"targetToken":"<ExampleTokenアドレス>"}}'
```

### 2. Sepolia テストネット

```bash
# 環境変数設定
export SEPOLIA_RPC_URL="https://rpc.sepolia.org"
export PRIVATE_KEY="0x..."

# ExampleTokenをデプロイしてアドレス取得
pnpm deploy:ExampleToken --network sepolia

# ExampleTokenアドレスでDonationPoolをデプロイ
pnpm deploy:DonationPool --network sepolia \
  --parameters '{"DonationPoolModule":{"targetToken":"<取得したアドレス>","initialSupportedTokens":["0x0000000000000000000000000000000000000000","<取得したアドレス>"]}}'
```

### 3. Ethereum Mainnet（本番）

```bash
# PYUSD本番環境設定
pnpm deploy:DonationPool --network mainnet \
  --parameters '{"DonationPoolModule":{"targetToken":"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8","initialSupportedTokens":["0x0000000000000000000000000000000000000000","0x6c3ea9036406852006290770BEdFcAbA0e23A0e8"]}}'
```

## ネットワーク別トークンアドレス

### PYUSD（PayPal USD）
- **Ethereum Mainnet**: `0x6c3ea9036406852006290770BEdFcAbA0e23A0e8`
- **テストネット**: ExampleTokenを使用

### よく使われるトークン
- **ETH**: `0x0000000000000000000000000000000000000000`
- **USDC (Mainnet)**: `0xA0b86a33E6411bF65074CB6e3c5Cd98D37b68Aef`

## デプロイ後の確認と設定

```bash
# デプロイメント状況確認
pnpm hardhat ignition status <deployment-id>

# コントラクト検証（推奨）
pnpm hardhat ignition verify <deployment-id> --network <network>
```

### 初期設定（デプロイ後に実行）

```bash
# Conversion Sinkの設定（Nexus SDK統合用）
# これは別途管理画面またはスクリプトで設定
```

## トラブルシューティング

### 1. targetTokenパラメータが必須エラー
```bash
# 解決方法: targetTokenを必ず指定
--parameters '{"DonationPoolModule":{"targetToken":"0x..."}}'
```

### 2. ガス不足エラー
```bash
# ガス制限を増加
--gas-limit 3000000
```

### 3. アドレス形式エラー
- アドレスは0xから始まる42文字である必要があります
- チェックサム形式（大文字小文字混在）を推奨

## スクリプト参考例

便利なbashスクリプトの例:

```bash
#!/bin/bash
# deploy-testnet.sh

echo "=== Deploying ExampleToken ==="
EXAMPLE_TOKEN_RESULT=$(pnpm deploy:ExampleToken --network sepolia)
EXAMPLE_TOKEN_ADDRESS=$(echo "$EXAMPLE_TOKEN_RESULT" | grep -o '0x[a-fA-F0-9]\{40\}')

echo "ExampleToken deployed at: $EXAMPLE_TOKEN_ADDRESS"

echo "=== Deploying DonationPool ==="
pnpm deploy:DonationPool --network sepolia \
  --parameters "{\"DonationPoolModule\":{\"targetToken\":\"$EXAMPLE_TOKEN_ADDRESS\",\"initialSupportedTokens\":[\"0x0000000000000000000000000000000000000000\",\"$EXAMPLE_TOKEN_ADDRESS\"]}}"

echo "=== Deployment Complete ==="
```
