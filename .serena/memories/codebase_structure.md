# コードベース構造 (2025年10月最新版)

## 全体アーキテクチャ
```
ethglobal-online-2025/
├── AGENTS.md                   # AI開発ガイドライン (ETHGlobal対応)
├── README.md                   # プロジェクト概要・セットアップ
├── package.json                # モノレポルート設定
├── pnpm-workspace.yaml         # pnpmワークスペース設定
├── biome.json                  # 共通リント・フォーマット設定
├── docs/                       # ドキュメント・アセット
│   └── assets/                 # 画像・リソース
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
│   │   │   └── Accordion.tsx # アコーディオンUI
│   │   ├── molecules/        # 複合要素
│   │   ├── nexus/            # Avail Nexus SDK専用コンポーネント
│   │   ├── organisms/        # 複雑なコンポーネント
│   │   └── providers/        # Context Providers
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
│   │   ├── errorHandler.ts   # エラーハンドリング
│   │   ├── addressFormatter.ts # アドレス表示フォーマット
│   │   ├── balanceProcessor.ts # 残高計算処理
│   │   ├── analyticsSuppressor.ts # アナリティクス制御
│   │   ├── responsive.ts     # レスポンシブユーティリティ
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
│       └── styles/           # グローバルスタイル
├── components.json           # Radix UI設定
├── tailwind.config.js        # Tailwind CSS 4.0設定
├── next.config.js            # Next.js設定
└── 設定ファイル (package.json, tsconfig.json, etc.)
```

## コントラクト構造 (pkgs/contract)
```
contract/
├── contracts/                 # Solidityコントラクト
│   ├── DonationPool.sol      # メイン寄付プールコントラクト
│   ├── ExampleToken.sol      # テスト用ERC20トークン
│   ├── Counter.sol           # Hardhat V3サンプルコントラクト
│   ├── interfaces/           # インターフェース定義
│   │   └── IDonationPool.sol # 寄付プールインターフェース
│   └── mocks/                # テスト用モック
│       └── ReentrantToken.sol # リエントランシーテスト用
├── test/                     # テストファイル (Node.js test runner)
│   ├── DonationPool.test.ts  # メインコントラクトテスト
│   └── Counter.test.ts       # Counterコントラクトテスト
├── scripts/                  # 実行スクリプト
│   ├── send-op-tx.ts         # Optimismトランザクション送信
│   ├── get-balance.ts        # 残高取得サンプル
│   ├── inc.ts                # Counterインクリメント
│   └── nexus-listener.ts     # Nexus イベントリスナー
├── ignition/modules/         # Hardhat Ignition デプロイ設定
│   └── Counter.ts            # Counterデプロイモジュール
├── helpers/                  # ヘルパー関数
│   └── contractJsonHelper.ts # コントラクト JSON操作
├── artifacts/                # コンパイル済みアーティファクト
│   ├── build-info/           # ビルド情報
│   └── contracts/            # コントラクトABI・バイトコード
├── cache/                    # Hardhatキャッシュ
├── hardhat.config.ts         # Hardhat V3設定
└── 設定ファイル (package.json, tsconfig.json, etc.)
```

## 主要コンポーネントの役割

### フロントエンド アプリケーション
- **app/page.tsx**: ランディングページ、プロジェクト一覧表示
- **app/create/**: プロジェクト作成フロー (フォーム、バリデーション)
- **app/donate/**: 寄付実行インターフェース (Nexus SDK統合)
- **app/admin/**: プロジェクト管理ダッシュボード (統計、出金管理)

### スマートコントラクト
- **DonationPool.sol**: メイン寄付プール管理 (PYUSD対応)
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