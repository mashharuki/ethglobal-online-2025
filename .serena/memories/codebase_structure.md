# コードベース構造 (2025年10月26日最新版)

## 全体アーキテクチャ
```
ethglobal-online-2025/
├── AGENTS.md                   # AI開発ガイドライン (ETHGlobal対応)
├── README.md                   # プロジェクト概要・セットアップ
├── package.json                # モノレポルート設定
├── pnpm-workspace.yaml         # pnpmワークスペース設定
├── biome.json                  # 共通リント・フォーマット設定
├── docs/                       # ドキュメント・アセット
│   └── assets/                 # 画像・リソース (logo.png, background.png)
├── .kiro/                      # 企画・設計ドキュメント
│   ├── steering/               # プロダクト仕様書
│   └── specs/                  # 詳細要件・設計書
├── .vscode/                    # VSCode設定
│   ├── mcp.json               # MCP設定
│   ├── settings.json          # エディタ設定
│   └── extensions.json        # 推奨拡張機能
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
│   │   │       ├── UnsupportedChainButton.tsx
│   │   │       ├── ConnectedWallet.tsx
│   │   │       └── ConnectButton.tsx
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
│           ├── base/         # ベーススタイル
│           ├── fonts/        # フォント設定
│           └── utilities/    # ユーティリティクラス
├── .env.example              # 環境変数テンプレート
├── components.json           # Radix UI設定
├── tailwind.config.js        # Tailwind CSS 4.0設定
├── next.config.js            # Next.js設定
├── postcss.config.js         # PostCSS設定
├── biome.json               # Biome設定
└── 設定ファイル (package.json, tsconfig.json, etc.)
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
│   ├── DonationPool.test.ts  # メインコントラクトテスト
│   ├── DonationPool.test.js  # JavaScript版テスト
│   ├── Counter.test.ts       # Counterコントラクトテスト
│   ├── CREATE2Factory.test.js # CREATE2ファクトリテスト
│   ├── SecurityFeatures.test.js # セキュリティテスト
│   ├── BalanceManagement.test.js # 残高管理テスト
│   └── USDCtoPYUSD.test.ts   # USDC-PYUSD変換テスト
├── scripts/                  # 実行スクリプト
│   ├── deploy.ts             # メインデプロイスクリプト
│   ├── deploy.js             # JavaScript版デプロイ
│   ├── send-op-tx.ts         # Optimismトランザクション送信
│   ├── get-balance.ts        # 残高取得サンプル
│   ├── inc.ts                # Counterインクリメント
│   └── nexus-listener.ts     # Nexus イベントリスナー
├── ignition/                 # Hardhat Ignition デプロイ設定
│   ├── DEPLOYMENT_ja.md      # デプロイメントガイド（日本語）
│   └── modules/              # デプロイモジュール
│       ├── Counter.ts        # Counterデプロイモジュール
│       ├── DonationPool.ts   # DonationPoolデプロイモジュール
│       └── ExampleToken.ts   # ExampleTokenデプロイモジュール
├── helpers/                  # ヘルパー関数
│   └── contractJsonHelper.ts # コントラクト JSON操作
├── artifacts/                # コンパイル済みアーティファクト
│   ├── build-info/           # ビルド情報
│   └── contracts/            # コントラクトABI・バイトコード
├── cache/                    # Hardhatキャッシュ
├── hardhat.config.ts         # Hardhat V3設定
├── hardhat.config.js         # JavaScript版設定
└── 設定ファイル (package.json, tsconfig.json, etc.)
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

### スマートコントラクト
- **DonationPool.sol**: メイン寄付プール管理 (PYUSD対応、セキュリティ強化)
- **CREATE2Factory.sol**: 統一アドレス生成（複数チェーン同一アドレス）
- **IDonationPool.sol**: インターフェース定義 (標準API)
- **ExampleToken.sol**: テスト用ERC20トークン

### 統合・インフラ
- **Nexus SDK統合**: @avail-project/nexus-core, nexus-widgets
- **Wagmi + RainbowKit**: 最新ウォレット接続 (2.x系)
- **Hardhat Ignition**: 本格的なデプロイメント管理
- **Biome**: 統一的なコード品質管理 (ESLint/Prettier代替)

## 開発フロー対応
- **Hot Reload**: Next.js 15高速開発サーバー
- **型安全性**: TypeScript 5.8完全統合
- **テスト**: Node.js組み込みテストランナー + Viem
- **デプロイ**: Hardhat Ignition宣言的デプロイメント
- **CREATE2**: 統一アドレス展開による真のクロスチェーン対応