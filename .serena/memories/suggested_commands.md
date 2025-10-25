# 推奨コマンド・操作ガイド (2025年10月26日最新版)

## プロジェクト初期セットアップ

### 依存関係インストール
```bash
# ルートで全パッケージをインストール
pnpm install

# フロントエンドのみ
pnpm frontend install

# コントラクトのみ
pnpm contract install
```

### 環境設定
```bash
# フロントエンド環境変数設定
cp pkgs/frontend/.env.example pkgs/frontend/.env.local

# 必要な環境変数を設定
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# - NEXT_PUBLIC_AVAIL_NEXUS_API_KEY (if required)
```

## 開発サーバー起動

### フロントエンド開発
```bash
# フロントエンド開発サーバー起動 (http://localhost:3000)
pnpm frontend dev

# 型チェック
pnpm frontend typecheck

# Biome lint/format
pnpm frontend check
```

### スマートコントラクト開発
```bash
# Hardhatローカルノード起動
pnpm contract hardhat node

# コントラクトコンパイル
pnpm contract compile

# テスト実行
pnpm contract test

# カバレッジレポート
pnpm contract coverage
```

## コード品質管理

### 統一コードフォーマット
```bash
# ルートレベルでBiome実行（全体）
pnpm biome:format
pnpm biome:check

# フロントエンドのみ
pnpm frontend format
pnpm frontend lint

# コントラクトのみ (Prettier + Solidity)
pnpm contract format
```

### 型安全性チェック
```bash
# フロントエンド型チェック
pnpm frontend typecheck

# コントラクト型チェック（コンパイル）
pnpm contract compile
```

## デプロイメント・テスト

### ローカルデプロイ
```bash
# ローカルHardhatノードにデプロイ
pnpm contract deploy

# Hardhat Ignition使用
pnpm contract hardhat ignition deploy ignition/modules/Counter.ts --network localhost
pnpm contract hardhat ignition deploy ignition/modules/DonationPool.ts --network localhost
```

### テストネットデプロイ
```bash
# Sepoliaにデプロイ
pnpm contract deploy:sepolia

# Arbitrum Sepoliaにデプロイ
pnpm contract deploy:arbitrum

# Ignition使用（推奨）
pnpm contract hardhat ignition deploy ignition/modules/DonationPool.ts --network sepolia
```

### テスト実行
```bash
# 全テスト実行
pnpm contract test

# 特定テスト実行
pnpm contract hardhat test test/DonationPool.test.ts
pnpm contract hardhat test test/Counter.test.ts

# ガスレポート付きテスト
pnpm contract hardhat test --gas-reporter
```

## Nexus SDK関連操作

### Nexus統合テスト
```bash
# Nexusリスナー起動
pnpm contract hardhat run scripts/nexus-listener.ts

# 残高取得テスト
pnpm contract hardhat run scripts/get-balance.ts

# クロスチェーントランザクション送信
pnpm contract hardhat run scripts/send-op-tx.ts
```

## デバッグ・ログ確認

### フロントエンド
```bash
# 開発モードでログ確認
pnpm frontend dev

# ビルドテスト
pnpm frontend build
pnpm frontend start
```

### コントラクト
```bash
# Hardhatコンソール起動
pnpm contract hardhat console --network localhost

# デバッグログ付きテスト
DEBUG=true pnpm contract test

# トランザクション詳細確認
pnpm contract hardhat run scripts/get-balance.ts --network sepolia
```

## CREATE2アドレス関連

### 統一アドレス計算・デプロイ
```bash
# CREATE2アドレス事前計算
pnpm contract hardhat run scripts/calculate-create2-address.ts

# CREATE2デプロイ
pnpm contract hardhat run scripts/deploy-create2.ts --network sepolia
pnpm contract hardhat run scripts/deploy-create2.ts --network arbitrumSepolia
```

## パフォーマンス・最適化

### バンドルサイズ分析
```bash
# Next.js バンドル分析
pnpm frontend build
npx @next/bundle-analyzer

# 依存関係分析
pnpm frontend why <package-name>
```

### コントラクトガス最適化
```bash
# ガス使用量レポート
pnpm contract hardhat test --gas-reporter

# ストレージレイアウト確認
pnpm contract hardhat storage-layout contracts/DonationPool.sol
```

## トラブルシューティング

### よくある問題と解決法
```bash
# キャッシュクリア
pnpm contract clean
rm -rf node_modules pnpm-lock.yaml
pnpm install

# TypeScript型エラー解決
pnpm frontend typecheck
pnpm contract compile

# Git hooks確認
pnpm frontend prepare

# Hardhat設定確認
pnpm contract hardhat config
```

### ログ・デバッグ出力
```bash
# 詳細ログ出力
DEBUG=* pnpm frontend dev
DEBUG=* pnpm contract test

# Nexus SDK デバッグ
DEBUG=nexus:* pnpm frontend dev
```

## ETHGlobal提出準備

### プロダクション準備
```bash
# フロントエンドプロダクションビルド
pnpm frontend build

# コントラクト最終テスト
pnpm contract test
pnpm contract coverage

# 全体品質チェック
pnpm biome:check
```

### デモ準備
```bash
# 全サービス同時起動
pnpm contract hardhat node &
pnpm frontend dev

# テストデータ投入
pnpm contract hardhat run scripts/deploy-test-data.ts --network localhost
```

## 高度なツール活用

### Hardhat Ignition詳細操作
```bash
# デプロイメント履歴確認
pnpm contract hardhat ignition list

# デプロイメント詳細確認
pnpm contract hardhat ignition status Counter#Counter

# デプロイメントロールバック（開発時）
pnpm contract hardhat ignition wipe Counter#Counter --network localhost
```

### Viem統合操作
```bash
# Viemクライアント使用例
pnpm contract hardhat run scripts/viem-example.ts

# 型安全なコントラクト操作
pnpm contract hardhat run scripts/typed-contract-calls.ts
```