# コードベース構造 (2025年10月26日最新版)

## 全体アーキテクチャ
```
ethglobal-online-2025/
├── AGENTS.md                   # AI開発ガイドライン (ETHGlobal対応)
├── README.md                   # プロジェクト概要・セットアップ
├── README_ja.md                # 日本語プロジェクト概要
├── package.json                # モノレポルート設定
├── pnpm-workspace.yaml         # pnpmワークスペース設定
├── pnpm-lock.yaml             # 依存関係ロックファイル
├── biome.json                  # 共通リント・フォーマット設定
├── .gitignore                  # Git無視ファイル設定
├── docs/                       # ドキュメント・アセット
│   └── assets/                 # 画像・リソース
│       ├── logo.png           # ロゴ画像
│       ├── background.png     # 背景画像
│       ├── overview.png       # 概要図
│       └── future.png         # 将来像図
├── .kiro/                      # 企画・設計ドキュメント (プロジェクト管理)
│   ├── settings/              # 設定ファイル
│   │   └── mcp.json          # MCP設定
│   ├── steering/              # プロダクト仕様書
│   │   ├── product.md        # プロダクト概要
│   │   ├── structure.md      # 構造設計
│   │   ├── hackathon_rule.md # ハッカソンルール
│   │   ├── product_idea.md   # プロダクトアイデア
│   │   └── tech.md           # 技術仕様
│   └── specs/                 # 詳細要件・設計書
│       └── cross-donate/     # CrossDonate仕様
│           ├── requirements.md # 要件定義
│           ├── tasks.md       # タスク管理
│           └── design.md      # 設計書
├── .vscode/                    # VSCode設定
│   ├── mcp.json               # MCP設定
│   ├── settings.json          # エディタ設定
│   └── extensions.json        # 推奨拡張機能
├── .serena/                    # Serena AI設定・メモリー
│   ├── project.yml            # プロジェクト設定
│   ├── .gitignore            # Serena用gitignore
│   └── memories/             # AIメモリーファイル
│       ├── codebase_structure.md     # コードベース構造
│       ├── project_overview.md       # プロジェクト概要
│       ├── design_patterns_guidelines.md # 設計パターン
│       ├── suggested_commands.md     # 推奨コマンド
│       ├── code_style_conventions.md # コーディング規約
│       ├── task_completion_checklist.md # タスクチェックリスト
│       └── tech_stack.md            # 技術スタック詳細
└── pkgs/                       # パッケージ群
    ├── frontend/               # Next.js 15 フロントエンド
    └── contract/               # Hardhat V3 スマートコントラクト
```

## フロントエンド構造 (pkgs/frontend)
```
frontend/
├── app/                        # Next.js 15 App Router
│   ├── page.tsx               # ホームページ (プロジェクト一覧)
│   ├── layout.tsx             # ルートレイアウト (Web3Provider等)
│   ├── create/
│   │   └── page.tsx           # プロジェクト作成ページ
│   ├── donate/[projectId]/
│   │   └── page.tsx           # 寄付実行ページ
│   └── admin/[projectId]/
│       └── page.tsx           # プロジェクト管理ダッシュボード
├── src/
│   ├── components/            # UIコンポーネント (Atomic Design)
│   │   ├── atoms/            # 基本要素
│   │   │   ├── Button.tsx    # 基本ボタンコンポーネント
│   │   │   ├── Card.tsx      # カードレイアウト
│   │   │   ├── Dialog.tsx    # モーダルダイアログ
│   │   │   ├── Input.tsx     # フォーム入力
│   │   │   ├── Textarea.tsx  # テキストエリア
│   │   │   ├── Label.tsx     # フォームラベル
│   │   │   ├── Switch.tsx    # トグルスイッチ
│   │   │   ├── Accordion.tsx # アコーディオンUI
│   │   │   ├── ScrollArea.tsx # スクロールエリア
│   │   │   └── Separator.tsx # 区切り線
│   │   ├── molecules/        # 複合要素
│   │   │   ├── WalletConnectButton.tsx # ウォレット接続ボタン
│   │   │   ├── ConnectWallet.tsx       # ウォレット接続コンポーネント
│   │   │   └── WalletConnectButton/    # ウォレット接続サブコンポーネント
│   │   │       ├── UnsupportedChainButton.tsx  # 非対応チェーンボタン
│   │   │       ├── ConnectedWallet.tsx          # 接続済みウォレット
│   │   │       └── ConnectButton.tsx            # 接続ボタン
│   │   ├── nexus/            # Avail Nexus SDK専用コンポーネント
│   │   │   ├── nexus.tsx     # Nexus統合メインコンポーネント
│   │   │   └── ViewUnifiedBalance.tsx # 統一残高表示
│   │   ├── organisms/        # 複雑なコンポーネント
│   │   │   ├── Header.tsx    # ヘッダーナビゲーション
│   │   │   ├── Footer.tsx    # フッター
│   │   │   ├── ProjectList.tsx # プロジェクト一覧表示
│   │   │   ├── DonatePageClient.tsx # 寄付ページクライアント
│   │   │   ├── AdminPermissionGuard.tsx # 管理者権限ガード
│   │   │   ├── AdminConversionCard.tsx # 管理者変換カード
│   │   │   └── RealtimeBalanceDisplay.tsx # リアルタイム残高表示
│   │   ├── providers/        # Context Providers
│   │   │   └── Web3ProviderWrapper.tsx # Web3プロバイダーラッパー
│   │   └── ErrorBoundary.tsx # エラーバウンダリ
│   ├── hooks/                # カスタムフック
│   │   ├── useNexusSDK.ts    # Nexus SDK統合フック
│   │   ├── useNexusBalance.ts # Nexus残高管理
│   │   ├── useWalletConnection.ts # ウォレット接続
│   │   ├── useErrorHandler.ts # エラーハンドリング
│   │   └── useMediaQuery.ts  # レスポンシブ対応
│   ├── types/                # TypeScript型定義
│   │   ├── project.ts        # プロジェクト関連型
│   │   ├── nexus.ts          # Nexus SDK関連型
│   │   ├── wallet.ts         # ウォレット関連型
│   │   ├── api.ts            # API関連型
│   │   └── index.ts          # 型エクスポート
│   ├── utils/                # ユーティリティ関数
│   │   ├── web3/             # Web3関連ユーティリティ
│   │   │   └── abi.ts        # コントラクトABI定義
│   │   ├── errorHandler.ts   # エラーハンドリング
│   │   ├── addressFormatter.ts # アドレス表示フォーマット
│   │   ├── balanceProcessor.ts # 残高計算処理
│   │   ├── analyticsSuppressor.ts # アナリティクス制御
│   │   ├── responsive.ts     # レスポンシブユーティリティ
│   │   ├── projectStorage.ts # プロジェクトストレージ管理
│   │   ├── create2Address.ts # CREATE2アドレス計算
│   │   └── utils.ts          # 汎用ユーティリティ
│   ├── providers/
│   │   └── Web3Provider.tsx  # Web3状態管理Provider
│   ├── mockdatas/            # 開発用モックデータ
│   │   ├── projects.ts       # プロジェクトデータ
│   │   ├── balances.ts       # 残高データ
│   │   ├── tokens.ts         # トークンデータ
│   │   ├── transactions.ts   # トランザクションデータ
│   │   └── index.ts          # モックデータエクスポート
│   └── themes/               # テーマ・スタイル設定
│       ├── settings/         # テーマ設定
│       │   └── color.ts      # カラーパレット
│       └── styles/           # グローバルスタイル
│           ├── globals.css   # グローバルCSS
│           ├── globals.css.d.ts # CSS型定義
│           ├── base/         # ベーススタイル
│           │   └── variables.css # CSS変数
│           ├── fonts/        # フォント設定
│           │   └── fonts.css # フォント定義
│           └── utilities/    # ユーティリティクラス
│               └── utilities.css # ユーティリティCSS
├── .env.example              # 環境変数テンプレート
├── .gitignore               # Git無視ファイル
├── components.json           # Radix UI設定
├── tailwind.config.js        # Tailwind CSS 4.0設定
├── next.config.js            # Next.js設定
├── next-env.d.ts            # Next.js型定義
├── postcss.config.js         # PostCSS設定
├── biome.json               # Biome設定
├── pnpm-lock.yaml           # 依存関係ロック
├── .git/hooks/              # Git hooks
│   ├── pre-commit           # コミット前フック
│   └── pre-push             # プッシュ前フック
└── 設定ファイル (package.json, tsconfig.json, README.md)
```

## コントラクト構造 (pkgs/contract)
```
contract/
├── contracts/                 # Solidityコントラクト
│   ├── DonationPool.sol      # メイン寄付プールコントラクト
│   ├── CREATE2Factory.sol   # CREATE2統一アドレスファクトリ
│   ├── ExampleToken.sol      # テスト用ERC20トークン
│   ├── Counter.sol           # Hardhat V3サンプルコントラクト
│   ├── MockERC20.sol         # モックERC20トークン
│   ├── ReentrancyAttacker.sol # リエントランシーテスト用
│   ├── interfaces/           # インターフェース定義
│   │   └── IDonationPool.sol # 寄付プールインターフェース
│   └── mocks/                # テスト用モック
│       ├── PYUSDToken.sol    # PYUSD モックトークン
│       ├── ReentrantToken.sol # リエントランシーテスト用
│       └── USDCToken.sol     # USDC モックトークン
├── test/                     # テストファイル (Node.js test runner)
│   ├── DonationPool.test.ts  # メインコントラクトテスト (TypeScript)
│   ├── DonationPool.test.js  # メインコントラクトテスト (JavaScript)
│   ├── Counter.test.ts       # Counterコントラクトテスト
│   ├── CREATE2Factory.test.js # CREATE2ファクトリテスト
│   ├── SecurityFeatures.test.js # セキュリティテスト
│   ├── BalanceManagement.test.js # 残高管理テスト
│   └── USDCtoPYUSD.test.ts   # USDC-PYUSD変換テスト
├── scripts/                  # 実行スクリプト
│   ├── deploy.ts             # メインデプロイスクリプト
│   ├── send-op-tx.ts         # Optimismトランザクション送信
│   ├── get-balance.ts        # 残高取得サンプル
│   ├── inc.ts                # Counterインクリメント
│   ├── donate.ts             # 寄付実行スクリプト
│   ├── swapUsdcToPyusd.ts    # USDC-PYUSD変換スクリプト
│   └── nexus-listener.ts     # Nexus イベントリスナー
├── ignition/                 # Hardhat Ignition デプロイ設定
│   ├── DEPLOYMENT_ja.md      # デプロイメントガイド（日本語）
│   └── modules/              # デプロイモジュール
│       ├── Counter.ts        # Counterデプロイモジュール
│       ├── DonationPool.ts   # DonationPoolデプロイモジュール
│       └── ExampleToken.ts   # ExampleTokenデプロイモジュール
├── helpers/                  # ヘルパー関数
│   ├── contractJsonHelper.ts # コントラクト JSON操作
│   └── abi/                  # ABI定義
│       └── ERC20.ts         # ERC20 ABI
├── .gitignore               # Git無視ファイル
├── hardhat.config.ts         # Hardhat V3設定
├── tsconfig.json            # TypeScript設定
└── 設定ファイル (package.json, README.md)
```

## 主要コンポーネントの役割

### フロントエンド アプリケーション
- **app/page.tsx**: ランディングページ、プロジェクト一覧表示
- **app/create/**: プロジェクト作成フロー (フォーム、バリデーション)
- **app/donate/**: 寄付実行インターフェース (Nexus SDK統合)
- **app/admin/**: プロジェクト管理ダッシュボード (統計、出金管理)

### Nexus SDK統合コンポーネント
- **useNexusSDK**: Nexus SDK初期化・管理フック
- **useNexusBalance**: 統一残高管理システム
- **nexus.tsx**: Nexusメインコンポーネント
- **ViewUnifiedBalance.tsx**: クロスチェーン残高表示

### ウォレット接続システム
- **useWalletConnection**: ウォレット接続・状態管理
- **WalletConnectButton**: 接続ボタンコンポーネント群
- **ConnectedWallet**: 接続済みウォレット表示
- **UnsupportedChainButton**: 非対応チェーン警告

### スマートコントラクト
- **DonationPool.sol**: メイン寄付プール管理 (PYUSD対応、セキュリティ強化)
  - 寄付受付: donateETH, donate
  - 資金管理: withdrawFunds, emergencyWithdrawETH/Token
  - 変換機能: swapUsdcToPyusd, initiateConversion
  - 設定管理: setConversionSink, setTargetToken
  - 残高管理: getAllBalances, getBalance, balanceOf
- **CREATE2Factory.sol**: 統一アドレス生成（複数チェーン同一アドレス）
- **IDonationPool.sol**: インターフェース定義 (標準API)
- **ExampleToken.sol**: テスト用ERC20トークン

### テスト・モック
- **PYUSDToken.sol, USDCToken.sol**: ステーブルコインモック
- **ReentrantToken.sol**: リエントランシーテスト用
- **SecurityFeatures.test.js**: セキュリティテスト群
- **BalanceManagement.test.js**: 残高管理テスト

### 統合・インフラ
- **Nexus SDK統合**: @avail-project/nexus-core, nexus-widgets
- **Wagmi + RainbowKit**: 最新ウォレット接続 (2.x系)
- **Hardhat Ignition**: 本格的なデプロイメント管理
- **Biome**: 統一的なコード品質管理 (ESLint/Prettier代替)

### 開発者体験
- **Git Hooks**: pre-commit (format/lint), pre-push (typecheck/check)
- **Simple Git Hooks**: 軽量なGitフック管理
- **TypeScript**: 完全型安全性 (フロントエンド・コントラクト)
- **Hot Reload**: Next.js 15高速開発サーバー

## 設定・管理ファイル
- **.kiro/**: プロジェクト企画・設計ドキュメント
- **.serena/**: AI開発支援システム設定・メモリー
- **.vscode/**: VSCode設定 (MCP, エディタ設定, 拡張機能)
- **docs/assets/**: プロジェクト画像リソース
- **biome.json**: 統一コード品質設定
- **pnpm-workspace.yaml**: モノレポ設定

## デプロイメント・運用
- **Hardhat Ignition**: 宣言的デプロイメント管理
- **CREATE2**: 統一アドレス展開による真のクロスチェーン対応
- **環境変数管理**: .env.example テンプレート
- **ネットワーク対応**: 複数EVM対応 (Ethereum, Arbitrum, Base等)