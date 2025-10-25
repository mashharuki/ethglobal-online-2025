# タスク完了時の実行項目

## コード品質チェックリスト
### 1. リンティング・フォーマット
```bash
# モノレポルートで実行
pnpm biome:check               # 全体のリント + フォーマット
pnpm biome:format              # 全体のフォーマット

# または個別パッケージで実行
pnpm frontend check            # フロントエンドのみ
pnpm contract format           # コントラクトのみ (Prettier)
```

### 2. TypeScriptタイプチェック
```bash
# フロントエンド
cd pkgs/frontend && pnpm typecheck

# コントラクト (ビルド時に自動実行)
cd pkgs/contract && pnpm build
```

## テスト実行
### 3. 単体テスト
```bash
# コントラクトテスト
cd pkgs/contract && pnpm test

# フロントエンド (将来的にテスト追加時)
cd pkgs/frontend && pnpm test
```

### 4. ビルドテスト
```bash
# フロントエンドビルド
cd pkgs/frontend && pnpm build

# コントラクトコンパイル
cd pkgs/contract && pnpm build
```

## セキュリティチェック
### 5. 依存関係監査
```bash
# セキュリティ脆弱性チェック
pnpm audit

# 修正可能な脆弱性の自動修正
pnpm audit --fix
```

### 6. コントラクトセキュリティ
- **ReentrancyGuard**: リエントランシー攻撃対策確認
- **Access Control**: Ownable権限管理確認
- **Input Validation**: 入力値検証確認
- **Custom Errors**: エラーハンドリング確認

## デプロイ前チェック
### 7. 環境変数確認
```bash
# 必須環境変数の設定確認
echo $SEPOLIA_RPC_URL
echo $ARBITRUM_SEPOLIA_RPC_URL
echo $PRIVATE_KEY
```

### 8. ネットワーク接続テスト
```bash
# テストネット接続確認
cd pkgs/contract && pnpm get-balance
```

## Git運用
### 9. コミット前チェック
```bash
# 変更ファイル確認
git status

# 差分確認
git diff

# コンベンショナルコミット形式でコミット
git commit -m "feat: add new donation feature"
git commit -m "fix: resolve wallet connection issue"
git commit -m "docs: update README with setup instructions"
git commit -m "test: add DonationPool contract tests"
git commit -m "refactor: improve error handling"
git commit -m "chore: update dependencies"
```

### 10. プッシュ前最終確認
```bash
# ブランチ確認
git branch

# リモート同期確認
git remote -v

# プッシュ
git push origin <feature-branch>
```

## ドキュメント更新
### 11. 必要に応じて更新
- **README.md**: 新機能の使用方法
- **コントラクト**: NatSpecコメント
- **型定義**: JSDocコメント
- **変更ログ**: 重要な変更の記録

## ETHGlobal提出準備
### 12. ハッカソン要件確認
- **Avail**: Nexus SDK使用確認
- **PayPal**: PYUSD統合確認
- **Hardhat**: Hardhat V3使用確認
- **デモ動画**: 機能動作確認
- **プレゼン資料**: 技術説明準備

## パフォーマンスチェック
### 13. 最適化確認 (本番環境向け)
```bash
# フロントエンドバンドルサイズ確認
cd pkgs/frontend && pnpm build && ls -la .next/

# コントラクトガス効率確認
cd pkgs/contract && pnpm test --gas-reporter
```

## 自動化されたチェック
### 14. CI/CDパイプライン (将来的)
- **GitHub Actions**: 自動テスト・ビルド
- **Dependabot**: 依存関係自動更新
- **CodeQL**: セキュリティ解析