# コードベース構造

## 全体アーキテクチャ
```
ethglobal-online-2025/
├── AGENTS.md                   # AI開発ガイドライン
├── README.md                   # プロジェクト概要
├── package.json                # モノレポルート設定
├── pnpm-workspace.yaml         # pnpmワークスペース設定
├── biome.json                  # 共通リント・フォーマット設定
└── pkgs/                       # パッケージ群
    ├── frontend/               # Next.jsフロントエンド
    └── contract/               # Hardhatスマートコントラクト
```

## フロントエンド構造 (pkgs/frontend)
```
frontend/
├── app/                        # Next.js App Router
│   ├── page.tsx               # ホームページ
│   ├── layout.tsx             # ルートレイアウト
│   ├── create/page.tsx        # プロジェクト作成
│   ├── donate/[projectId]/    # 寄付ページ
│   └── admin/[projectId]/     # 管理ページ
├── src/
│   ├── components/            # UIコンポーネント (Atomic Design)
│   │   ├── atoms/            # 基本要素 (Button, Card, Input等)
│   │   ├── molecules/        # 複合要素
│   │   ├── nexus/            # Nexus SDK関連
│   │   ├── organisms/        # 複雑なコンポーネント
│   │   └── providers/        # Context Providers
│   ├── hooks/                # カスタムフック
│   │   ├── useNexusSDK.ts    # Nexus SDK統合
│   │   ├── useWalletConnection.ts
│   │   └── useErrorHandler.ts
│   ├── types/                # TypeScript型定義
│   │   ├── project.ts        # プロジェクト関連型
│   │   ├── nexus.ts          # Nexus関連型
│   │   └── wallet.ts         # ウォレット関連型
│   ├── utils/                # ユーティリティ関数
│   │   ├── web3/             # Web3関連ユーティリティ
│   │   ├── errorHandler.ts   # エラーハンドリング
│   │   └── addressFormatter.ts
│   ├── mockdatas/            # 開発用モックデータ
│   │   ├── projects.ts       # プロジェクトデータ
│   │   ├── balances.ts       # 残高データ
│   │   └── transactions.ts   # トランザクションデータ
│   └── themes/               # テーマ・スタイル設定
└── 設定ファイル (package.json, tailwind.config.js, etc.)
```

## コントラクト構造 (pkgs/contract)
```
contract/
├── contracts/                 # Solidityコントラクト
│   ├── DonationPool.sol      # メインコントラクト
│   ├── ExampleToken.sol      # テスト用トークン
│   ├── Counter.sol           # サンプルコントラクト
│   ├── interfaces/           # インターフェース定義
│   │   └── IDonationPool.sol
│   └── mocks/                # テスト用モック
│       └── ReentrantToken.sol
├── test/                     # テストファイル
│   ├── DonationPool.test.ts  # メインテスト
│   └── Counter.test.ts       # サンプルテスト
├── scripts/                  # デプロイ・実行スクリプト
│   ├── send-op-tx.ts         # OPトランザクション
│   ├── get-balance.ts        # 残高取得
│   └── inc.ts                # Counter操作
├── ignition/modules/         # Ignitionデプロイ設定
│   └── Counter.ts
├── artifacts/                # コンパイル済みアーティファクト
├── cache/                    # Hardhatキャッシュ
└── helpers/                  # ヘルパー関数
    └── contractJsonHelper.ts
```

## 主要コンポーネントの役割

### フロントエンド
- **app/page.tsx**: ランディングページ、プロジェクト一覧
- **app/create/**: プロジェクト作成フロー
- **app/donate/**: 寄付実行インターフェース
- **app/admin/**: プロジェクト管理ダッシュボード

### スマートコントラクト
- **DonationPool.sol**: メイン寄付プール管理
- **IDonationPool.sol**: インターフェース定義
- **ExampleToken.sol**: テスト用ERC20トークン

### 統合ポイント
- **Nexus SDK**: クロスチェーン機能の実現
- **Wagmi + RainbowKit**: ウォレット接続
- **Hardhat Ignition**: デプロイ管理
- **Biome**: 統一的なコード品質管理