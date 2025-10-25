# 技術スタック詳細

## 開発環境要件
- **Node.js**: 22+ (engines指定)
- **パッケージマネージャ**: pnpm 10.13.1
- **TypeScript**: ~5.8.0

## フロントエンド技術スタック
### フレームワーク・ライブラリ
- **Next.js**: 15.0.0 (最新版)
- **React**: 19.0.0 (最新版)
- **TypeScript**: ESModuleベース

### Web3関連
- **Avail Nexus SDK**: 
  - @avail-project/nexus-core: 0.0.1-beta.0
  - @avail-project/nexus-widgets: 0.1.11-beta.0
- **Wallet接続**: 
  - @rainbow-me/rainbowkit: 2.2.8
  - wagmi: 2.17.2
  - viem: 2.37.7
- **クエリ管理**: @tanstack/react-query: 5.90.1

### UI・スタイリング
- **CSS Framework**: Tailwind CSS 4.0.6
- **UI Components**: Radix UI (accordion, dialog, label, scroll-area, separator, slot, switch)
- **アイコン**: Lucide React 0.523.0
- **ユーティリティ**: 
  - class-variance-authority: 0.7.1
  - clsx: 2.1.1
  - tailwind-merge: 3.3.1

### その他
- **QRコード**: qrcode 1.5.4
- **React Hooks**: react-use 17.6.0

## バックエンド技術スタック
### スマートコントラクト
- **Hardhat**: 3.0.7 (V3最新版)
- **Solidity**: 0.8.28
- **OpenZeppelin**: 5.0.0

### 開発ツール
- **Hardhat Toolbox**: @nomicfoundation/hardhat-toolbox-viem 5.0.0
- **Viem**: 2.30.0 (Ethereumクライアント)
- **Ignition**: @nomicfoundation/hardhat-ignition 3.0.0 (デプロイメント)
- **Verify**: @nomicfoundation/hardhat-verify 3.0.3

## 共通開発ツール
### リンティング・フォーマット
- **Biome**: 2.2.6 (高速リンター・フォーマッター)
  - ESLint + Prettierの代替
  - 統一設定でモノレポ全体を管理
- **Prettier**: 3.0.0 (コントラクト用)
  - prettier-plugin-solidity: 1.2.0

### ネットワーク
- **テストネット**: Sepolia, Arbitrum Sepolia
- **ローカル**: Hardhat Node
- **チェーンタイプ**: L1, Optimism