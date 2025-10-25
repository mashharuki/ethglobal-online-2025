# 技術スタック詳細 (2025年10月最新版)

## 開発環境要件
- **Node.js**: 22+ (engines指定)
- **パッケージマネージャ**: pnpm 10.13.1
- **TypeScript**: ~5.8.0 (最新安定版)

## フロントエンド技術スタック
### 最新フレームワーク
- **Next.js**: 15.0.0 (最新安定版、App Router)
- **React**: 19.0.0 (最新リリース、Server Components対応)
- **TypeScript**: ESModule完全対応

### Web3・ブロックチェーン統合
- **Avail Nexus SDK**: 
  - @avail-project/nexus-core: 0.0.1-beta.0
  - @avail-project/nexus-widgets: 0.1.11-beta.0
- **ウォレット接続**: 
  - @rainbow-me/rainbowkit: 2.2.8
  - wagmi: 2.17.2 (React Hooks for Ethereum)
  - @wagmi/core: 2.18.0
  - viem: 2.37.7 (TypeScript Ethereum library)
- **状態管理**: @tanstack/react-query: 5.90.1

### モダンUI・スタイリング
- **CSS Framework**: Tailwind CSS 4.0.6 (最新メジャー版)
- **PostCSS**: @tailwindcss/postcss 4.1.14
- **UI Components**: Radix UI生態系
  - @radix-ui/react-accordion: 1.2.11
  - @radix-ui/react-dialog: 1.1.14
  - @radix-ui/react-label: 2.1.7
  - @radix-ui/react-scroll-area: 1.2.9
  - @radix-ui/react-separator: 1.1.7
  - @radix-ui/react-slot: 1.2.3
  - @radix-ui/react-switch: 1.2.5
- **アイコン**: Lucide React 0.523.0
- **ユーティリティ**: 
  - class-variance-authority: 0.7.1
  - clsx: 2.1.1
  - tailwind-merge: 3.3.1

### 追加機能ライブラリ
- **QRコード**: qrcode 1.5.4 + @types/qrcode 1.5.5
- **React Hooks**: react-use 17.6.0
- **開発ツール**: simple-git-hooks

## バックエンド・スマートコントラクト
### Hardhat V3エコシステム
- **Hardhat**: 3.0.7 (V3最新版)
- **Hardhat Toolbox**: @nomicfoundation/hardhat-toolbox-viem 5.0.0
- **Hardhat Ignition**: @nomicfoundation/hardhat-ignition 3.0.0 (デプロイメント管理)
- **Hardhat Verify**: @nomicfoundation/hardhat-verify 3.0.3
- **Hardhat Viem**: @nomicfoundation/hardhat-viem 3.0.0

### Solidity・セキュリティ
- **Solidity**: 0.8.28 (最新安定版)
- **OpenZeppelin**: 5.0.0 (最新メジャー版)
- **Viem**: 2.30.0 (TypeScript Ethereum client)

## 共通開発ツール
### コード品質管理
- **Biome**: 
  - @biomejs/biome: 2.2.6 (フロントエンド)
  - @biomejs/biome: 1.9.4 (ルート)
- **Prettier**: 3.0.0 (コントラクト専用)
  - prettier-plugin-solidity: 1.2.0

### 型システム
- **TypeScript**: ~5.8.0
- **型定義**:
  - @types/node: 24.0.4 (フロントエンド), 22.8.5 (コントラクト)
  - @types/react: 19.0.8
  - @types/react-dom: 19.0.3

## ネットワーク・デプロイメント
### 対応ネットワーク
- **メインネット**: Ethereum, Arbitrum
- **テストネット**: Sepolia, Arbitrum Sepolia
- **ローカル**: Hardhat Node (L1, Optimism シミュレート)
- **Nexus統合**: Avail DA layer対応

### デプロイメント戦略
- **Hardhat Ignition**: 宣言的デプロイメント管理
- **マルチネットワーク**: 環境変数ベースのネットワーク設定
- **検証**: 自動コントラクト検証 (Etherscan対応)

## パッケージ管理
- **ワークスペース**: pnpm workspace (高速・効率的)
- **ロックファイル**: pnpm-lock.yaml (決定論的インストール)
- **エンジン制約**: Node.js 22+ 強制