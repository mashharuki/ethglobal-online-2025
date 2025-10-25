# 推奨コマンド一覧 (2025年10月最新版)

## モノレポルート操作
```bash
# 基本セットアップ
pnpm install                    # 全パッケージの依存関係インストール
pnpm biome:format              # 全体フォーマット (Biome)
pnpm biome:check               # 全体リント + フォーマット

# パッケージ別操作 (フィルター実行)
pnpm frontend <command>        # フロントエンドパッケージでコマンド実行
pnpm contract <command>        # コントラクトパッケージでコマンド実行

# 例: パッケージ別ビルド
pnpm frontend build            # フロントエンドのみビルド
pnpm contract build            # コントラクトのみコンパイル
```

## フロントエンド開発 (pkgs/frontend)
```bash
# Next.js 15開発サーバー
pnpm dev                       # 開発サーバー起動 (http://localhost:3000)
pnpm build                     # プロダクションビルド (.next/)
pnpm start                     # プロダクションサーバー起動

# コード品質管理 (Biome)
pnpm lint                      # Biomeリント (自動修正あり)
pnpm format                    # Biomeフォーマット
pnpm check                     # Biomeリント + フォーマット統合実行
pnpm typecheck                 # TypeScript型チェック (tsc --noEmit)

# 開発環境設定
pnpm prepare                   # Git hooks セットアップ (simple-git-hooks)
```

## コントラクト開発 (pkgs/contract)
```bash
# Hardhat V3基本操作
pnpm build                     # Solidityコンパイル (artifacts生成)
pnpm clean                     # アーティファクト・キャッシュ削除
pnpm test                      # テスト実行 (Node.js test runner + Viem)

# Hardhat Ignition デプロイメント
pnpm deploy:Counter            # Counterコントラクトデプロイ
pnpm deploy:ExampleToken       # ExampleTokenデプロイ（テスト用）
pnpm deploy:DonationPool       # DonationPoolデプロイ（パラメータ必須）

# DonationPool デプロイメント例
# テストネット用（ExampleTokenをターゲット）
pnpm deploy:ExampleToken --network sepolia
pnpm deploy:DonationPool --network sepolia \
  --parameters '{"DonationPoolModule":{"targetToken":"<ExampleTokenアドレス>"}}'

# Mainnet用（PYUSDをターゲット）
pnpm deploy:DonationPool --network mainnet \
  --parameters '{"DonationPoolModule":{"targetToken":"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8"}}'

# スクリプト実行
pnpm send-op-tx               # Optimismトランザクション送信サンプル
pnpm get-balance              # 残高取得サンプル
pnpm increment-counter        # Counterインクリメント実行

# コード品質 (Prettier + Solidity)
pnpm format                   # Prettier フォーマット
pnpm format:check             # フォーマットチェック (CI用)
```

## Hardhat V3詳細操作
```bash
# ローカル開発
pnpm hardhat node             # ローカルノード起動 (Anvil互換)
pnpm hardhat compile          # コントラクトコンパイル
pnpm hardhat test             # テスト実行

# Hardhat Ignition (宣言的デプロイメント)
pnpm hardhat ignition deploy <module> [--network <network>] [--parameters <json>]
pnpm hardhat ignition verify <deployment-id> --network <network>

# パラメータ付きデプロイ例
pnpm hardhat ignition deploy ignition/modules/DonationPool.ts \
  --network sepolia \
  --parameters '{"DonationPoolModule":{"targetToken":"0x1234...", "initialSupportedTokens":["0x0000000000000000000000000000000000000000","0x1234..."]}}'

# 対応ネットワーク
# - hardhat (ローカル)
# - hardhatMainnet (L1シミュレート)
# - hardhatOp (Optimismシミュレート)
# - sepolia (Ethereumテストネット)
# - arbitrumSepolia (Arbitrumテストネット)
# - mainnet (Ethereum本番)

# コンソール・デバッグ
pnpm hardhat console --network <network>
pnpm hardhat run scripts/<script>.ts --network <network>

# デプロイメント状況確認
pnpm hardhat ignition status <deployment-id>
```

## 環境変数設定
```bash
# .env ファイル作成 (pkgs/contract/.env)
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
MAINNET_RPC_URL=https://mainnet.infura.io/v3/<key>
PRIVATE_KEY=0x...              # デプロイ・テスト用秘密鍵 (testnet用)
ETHERSCAN_API_KEY=...          # コントラクト検証用 (オプション)
```

## Git運用 (macOS zsh対応)
```bash
# 基本操作
git status                     # 変更状況確認
git add .                      # 全変更をステージング
git diff                       # 変更差分確認
git diff --staged              # ステージング済み差分確認

# コンベンショナルコミット (ETHGlobal審査員向け英語)
git commit -m "feat: add flexible DonationPool deployment with parameter support"
git commit -m "feat: integrate Nexus SDK for cross-chain donations"
git commit -m "feat: add PYUSD support with mainnet/testnet configuration"
git commit -m "fix: resolve wallet connection timeout issue"
git commit -m "docs: update deployment guide with parameter examples"
git commit -m "test: add comprehensive DonationPool contract tests"
git commit -m "refactor: improve error handling in donation flow"
git commit -m "chore: update dependencies to latest stable versions"

# ブランチ管理
git checkout -b feature/nexus-integration
git checkout -b fix/wallet-connection
git merge main
git push origin <branch>
```

## 完全なデプロイワークフロー
```bash
# テストネット完全セットアップ
# 1. 環境変数設定
export SEPOLIA_RPC_URL="https://rpc.sepolia.org"
export PRIVATE_KEY="0x..."

# 2. コントラクトビルド
pnpm contract build

# 3. ExampleTokenデプロイ
TOKEN_RESULT=$(pnpm contract deploy:ExampleToken --network sepolia)
TOKEN_ADDRESS=$(echo "$TOKEN_RESULT" | grep -o '0x[a-fA-F0-9]\{40\}' | head -1)

# 4. DonationPoolデプロイ
pnpm contract deploy:DonationPool --network sepolia \
  --parameters "{\"DonationPoolModule\":{\"targetToken\":\"$TOKEN_ADDRESS\",\"initialSupportedTokens\":[\"0x0000000000000000000000000000000000000000\",\"$TOKEN_ADDRESS\"]}}"

# 5. デプロイメント確認
pnpm hardhat ignition status <deployment-id>

# 6. コントラクト検証
pnpm hardhat ignition verify <deployment-id> --network sepolia

# 7. テスト実行
pnpm contract test
```

## 開発ワークフロー
```bash
# 新機能開発の典型的な流れ
git checkout -b feature/new-feature
pnpm biome:check               # コード品質チェック
pnpm frontend typecheck        # 型チェック
pnpm contract test             # コントラクトテスト
pnpm frontend build            # ビルドテスト
git add .
git commit -m "feat: implement new feature"
git push origin feature/new-feature

# 本番デプロイ前チェック
pnpm biome:check               # 全体コード品質
pnpm frontend build            # フロントエンドビルド
pnpm contract test             # コントラクトテスト
pnpm audit                     # セキュリティ監査
```

## macOS固有のユーティリティ
```bash
# ファイル・ディレクトリ操作
find . -name "*.ts" -not -path "*/node_modules/*"  # TypeScriptファイル検索
grep -r "useNexusSDK" src/     # パターン検索
ls -la                         # 詳細リスト表示
du -sh node_modules/           # ディレクトリサイズ確認

# プロセス・ネットワーク管理
ps aux | grep "next-server"    # Next.jsプロセス確認
lsof -i :3000                  # ポート3000使用状況
kill -9 $(lsof -t -i :3000)   # ポート3000プロセス強制終了

# ログ・モニタリング
tail -f ~/.pnpm-state/pnpm.log # pnpmログ監視
cat package.json | jq '.dependencies'  # 依存関係JSON整形表示

# アドレス抽出（デプロイ後）
echo "$DEPLOY_OUTPUT" | grep -o '0x[a-fA-F0-9]\{40\}' | head -1
```

## ETHGlobal提出用コマンド
```bash
# 最終チェック・ビルド
pnpm biome:check && pnpm frontend build && pnpm contract test
git log --oneline -10          # 最新10コミット確認
git remote -v                  # リモートリポジトリ確認
du -sh .                       # プロジェクトサイズ確認

# デプロイメント状況レポート
echo "=== Deployment Summary ===" 
pnpm hardhat ignition status <deployment-id>
echo "Target Token: <target-token-address>"
echo "Network: <network-name>"
echo "=========================="
```