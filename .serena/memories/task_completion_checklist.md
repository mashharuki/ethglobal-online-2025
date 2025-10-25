# タスク完了時の実行項目 (2025年10月最新版)

## 必須実行チェックリスト

### 1. コード品質管理
```bash
# モノレポ全体の品質チェック
pnpm biome:check               # Biome統合リント+フォーマット
pnpm biome:format              # 必要に応じてフォーマット修正

# パッケージ別品質チェック
pnpm frontend check            # フロントエンド (Biome)
pnpm frontend typecheck        # TypeScript型チェック
pnpm contract format           # コントラクト (Prettier + Solidity)
```

### 2. ビルド・コンパイルテスト
```bash
# プロダクションビルド確認
pnpm frontend build            # Next.js 15ビルド
pnpm contract build            # Solidityコンパイル

# 型安全性確認
cd pkgs/frontend && pnpm typecheck
cd pkgs/contract && tsc --noEmit
```

### 3. テスト実行
```bash
# コントラクトテスト (Hardhat V3 + Node.js test runner)
cd pkgs/contract && pnpm test

# フロントエンドテスト (将来的)
# cd pkgs/frontend && pnpm test

# E2Eテスト (将来的)
# pnpm test:e2e
```

## セキュリティ・品質チェック

### 4. 依存関係セキュリティ監査
```bash
# セキュリティ脆弱性チェック
pnpm audit                     # 全パッケージ監査
pnpm audit --fix               # 修正可能な脆弱性自動修正

# 依存関係更新確認
pnpm outdated                  # 古い依存関係確認
```

### 5. コントラクトセキュリティ確認
- **ReentrancyGuard**: 全payable関数に適用確認
- **Access Control**: Ownable/役割ベース権限管理確認
- **Input Validation**: ゼロアドレス・ゼロ値チェック確認
- **Custom Errors**: revert stringではなくcustom error使用確認
- **OpenZeppelin**: 最新版(5.0.0)使用確認

### 6. フロントエンドセキュリティ
- **環境変数**: 機密情報のハードコード禁止確認
- **XSS対策**: ユーザー入力の適切なサニタイズ
- **CSRF対策**: Next.js built-in対策活用
- **ウォレット接続**: RainbowKit標準セキュリティ適用

## 環境・設定確認

### 7. 環境変数・設定
```bash
# 必須環境変数の存在確認
echo $SEPOLIA_RPC_URL          # Sepoliaテストネット
echo $ARBITRUM_SEPOLIA_RPC_URL # Arbitrumテストネット
echo $PRIVATE_KEY              # デプロイ用秘密鍵 (testnet only)

# 設定ファイル確認
cat hardhat.config.ts | grep -E "sepolia|arbitrum"
cat next.config.js | grep -E "env|public"
```

### 8. ネットワーク接続テスト
```bash
# テストネット接続確認
cd pkgs/contract && pnpm get-balance --network sepolia
cd pkgs/contract && pnpm get-balance --network arbitrumSepolia

# RPCエンドポイント確認
curl -X POST $SEPOLIA_RPC_URL -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

## Git・バージョン管理

### 9. コミット前確認
```bash
# 変更ファイル確認
git status                     # 追跡対象・未追跡ファイル確認
git diff                       # 変更差分確認
git diff --staged              # ステージング済み差分

# コンベンショナルコミット (ETHGlobal審査員向け英語)
git commit -m "feat: integrate Avail Nexus SDK for cross-chain donations"
git commit -m "feat: add PYUSD support with PayPal integration"
git commit -m "feat: implement Hardhat V3 deployment with Ignition"
git commit -m "fix: resolve wallet connection timeout in RainbowKit"
git commit -m "test: add comprehensive DonationPool security tests"
git commit -m "docs: update README with Nexus SDK setup guide"
git commit -m "refactor: improve error handling across donation flow"
git commit -m "chore: upgrade to Next.js 15 and React 19"
```

### 10. プッシュ前最終確認
```bash
# ブランチ・リモート確認
git branch -v                  # ローカルブランチ一覧
git remote -v                  # リモートリポジトリ確認
git log --oneline -5           # 最新5コミット確認

# プッシュ実行
git push origin <feature-branch>
```

## ドキュメント・メタデータ

### 11. ドキュメント更新
- **README.md**: セットアップ手順、Nexus SDK使用方法
- **コントラクトNatSpec**: すべてのpublic/external関数
- **型定義JSDoc**: 複雑な型・インターフェース
- **CHANGELOG.md**: 重要な変更・リリース情報 (将来的)

### 12. パッケージメタデータ確認
```bash
# package.json メタデータ確認
jq '.name, .version, .description' package.json
jq '.dependencies | keys[]' pkgs/frontend/package.json
jq '.devDependencies | keys[]' pkgs/contract/package.json

# ライセンス・作者情報確認
jq '.author, .license' package.json
```

## ETHGlobal固有要件

### 13. ハッカソン要件確認
- **Avail Prize**: Nexus SDK (`@avail-project/nexus-core`, `nexus-widgets`) 使用確認
- **PayPal Prize**: PYUSD統合機能動作確認
- **Hardhat Prize**: Hardhat V3 (3.0.7) + Viem統合確認
- **デモ準備**: フルフローの動作確認
- **プレゼン**: 技術アーキテクチャ説明準備

### 14. 提出用最終チェック
```bash
# 総合品質確認
pnpm biome:check && pnpm frontend build && pnpm contract test

# プロジェクトサイズ・構成確認
du -sh .                       # プロジェクト総サイズ
find . -name "*.ts" -o -name "*.tsx" -o -name "*.sol" | wc -l  # ソースファイル数
git log --oneline --since="2025-10-10" | wc -l  # ハッカソン期間中のコミット数

# リポジトリ状態確認
git remote get-url origin      # GitHub URL確認
git branch --show-current      # 現在ブランチ
git status --porcelain         # 未コミット変更確認
```

## パフォーマンス最適化 (オプション)

### 15. 本番向け最適化確認
```bash
# フロントエンドバンドル分析
cd pkgs/frontend && pnpm build
ls -la .next/static/           # 静的アセットサイズ確認

# コントラクトガス効率
cd pkgs/contract && pnpm test --gas-reporter  # ガス使用量レポート
```

### 16. 自動化・CI/CD (将来的準備)
- **GitHub Actions**: 自動テスト・ビルドワークフロー
- **Dependabot**: 依存関係自動更新設定
- **CodeQL**: セキュリティ脆弱性自動検出
- **Vercel**: フロントエンド自動デプロイ設定