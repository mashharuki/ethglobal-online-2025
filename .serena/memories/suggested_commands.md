# 推奨コマンド一覧

## モノレポルートコマンド
```bash
# 基本操作
pnpm install                    # 全パッケージの依存関係インストール
pnpm biome:format              # 全体フォーマット
pnpm biome:check               # 全体リント + フォーマット

# パッケージ別操作
pnpm frontend <command>        # フロントエンドパッケージでコマンド実行
pnpm contract <command>        # コントラクトパッケージでコマンド実行
```

## フロントエンド開発コマンド (pkgs/frontend)
```bash
# 開発・ビルド
pnpm dev                       # 開発サーバー起動 (Next.js)
pnpm build                     # プロダクションビルド
pnpm start                     # プロダクションサーバー起動

# コード品質
pnpm lint                      # Biomeリント (自動修正)
pnpm format                    # Biomeフォーマット
pnpm check                     # Biomeリント + フォーマット
pnpm typecheck                 # TypeScriptタイプチェック

# Git
pnpm prepare                   # Git hooksセットアップ
```

## コントラクト開発コマンド (pkgs/contract)
```bash
# ビルド・テスト
pnpm build                     # コントラクトコンパイル
pnpm clean                     # アーティファクト削除
pnpm test                      # テスト実行 (Hardhat v3 + Viem)

# デプロイメント
pnpm deploy:Counter            # Counterコントラクトデプロイ (Ignition)
pnpm hardhat ignition deploy ignition/modules/Counter.ts --network sepolia

# スクリプト実行
pnpm send-op-tx               # OPトランザクション送信
pnpm get-balance              # 残高取得サンプル
pnpm increment-counter        # Counterインクリメント

# コード品質
pnpm format                   # Prettier フォーマット
pnpm format:check             # フォーマットチェック
```

## Hardhat詳細コマンド
```bash
# ネットワーク管理
pnpm hardhat node             # ローカルノード起動
pnpm hardhat compile          # コントラクトコンパイル
pnpm hardhat test             # テスト実行

# デプロイメント (Ignition)
pnpm hardhat ignition deploy <module> [--network <network>]
pnpm hardhat ignition deploy ignition/modules/Counter.ts --network arbitrumSepolia

# ネットワーク設定
# - hardhatMainnet (L1シミュレート)
# - hardhatOp (Optimismシミュレート)  
# - sepolia (テストネット)
# - arbitrumSepolia (テストネット)
```

## 環境変数設定
```bash
# 必須環境変数 (.env ファイル作成)
SEPOLIA_RPC_URL=<Sepolia RPC URL>
ARBITRUM_SEPOLIA_RPC_URL=<Arbitrum Sepolia RPC URL>
PRIVATE_KEY=<デプロイ・テスト用秘密鍵>
```

## Git運用コマンド (macOS/zsh)
```bash
# 基本操作
git status                     # 変更状況確認
git add .                      # 全変更をステージング
git commit -m "feat: 機能追加" # コンベンショナルコミット
git push origin <branch>       # リモートにプッシュ

# ブランチ管理
git checkout -b feature/new-feature
git merge main
git branch -d feature/old-feature
```

## macOS固有のユーティリティ
```bash
# ファイル検索・操作
find . -name "*.ts" -type f    # TypeScriptファイル検索
grep -r "pattern" src/         # パターン検索
ls -la                         # 詳細リスト表示
cat package.json               # ファイル内容表示
head -20 README.md             # ファイル先頭20行表示
tail -f logs/app.log           # ファイル末尾追跡

# プロセス管理
ps aux | grep node             # Node.jsプロセス確認
kill -9 <PID>                  # プロセス強制終了
lsof -i :3000                  # ポート3000使用状況確認
```