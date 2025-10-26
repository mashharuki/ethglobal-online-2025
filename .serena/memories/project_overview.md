# CrossDonate - ETHGlobal Online 2025 プロジェクト概要

## プロジェクトの目的
CrossDonateは、Web3寄付の断片化問題を解決する革新的なクロスチェーン寄付プラットフォームです。「Universal Non-Custodial Donation Receiver」として、寄付者と受益者双方の課題を解決します。

### 核心的な価値提案
- **統一寄付アドレス**: CREATE2を利用した複数のEVMチェーンでの同一アドレス展開
- **自動変換・集約**: Avail Nexus SDKによる自動的なトークン変換・集約
- **クロスチェーン対応**: 複数のブロックチェーン間での寄付受付・処理
- **PYUSD統合**: PayPalのステーブルコインPYUSDを活用した安定した寄付体験
- **分散型セキュリティ**: ReentrancyGuard、Ownable2Step等による堅牢なセキュリティ

### 解決する課題
**寄付者の課題:**
- 高い寄付ハードル（特定チェーン・トークン保有が必要）
- ブリッジ・スワップの手間とガス代
- 送金ミスリスク（チェーンごとのアドレス管理）

**運営者の課題:**
- 資産管理の煩雑さ（多様なチェーン・トークンでの受け取り）
- ガス詰み問題（ガス代用トークンがない場合の資産移動不可）
- 会計処理の複雑化（トークン交換履歴の管理）
- セキュリティリスク（秘密鍵管理の単一障害点）

### 対象となるETHGlobalプライズ
1. **Avail Prize**: Nexus SDK (@avail-project/nexus-core 0.0.1-beta.0, @avail-project/nexus-widgets 0.1.11-beta.0) を使用
2. **PayPal Prize**: PYUSD (PayPal USD) ステーブルコインを統合
3. **Hardhat Prize**: Hardhat V3 (3.0.7) + Viem統合を使用

## アーキテクチャ
pnpmワークスペースベースのモノレポ構成：

### pkgs/frontend (Next.js 15 + React 19)
- **最新フレームワーク**: Next.js 15.0.0 + React 19.0.0 (App Router)
- **Avail Nexus SDK統合**: クロスチェーン機能の実現
- **ウォレット統合**: RainbowKit 2.2.8 + Wagmi 2.17.2 + Viem 2.37.7
- **UI Framework**: Tailwind CSS 4.0.6 + Radix UI エコシステム
- **状態管理**: TanStack Query 5.90.1 + Context API
- **開発体験**: TypeScript 5.7.2 + Biome 2.2.6

### pkgs/contract (Hardhat V3 + Solidity)
- **開発環境**: Hardhat 3.0.7 (V3最新版) + Viem 2.30.0統合
- **スマートコントラクト**: Solidity 0.8.28 + OpenZeppelin 5.0.0
- **デプロイメント**: Hardhat Ignition 3.0.0
- **セキュリティ**: ReentrancyGuard, Ownable2Step, カスタムエラー
- **テスト**: Node.js 組み込みテストランナー + Viem統合

## 主要機能実装
1. **プロジェクト作成**: 寄付プロジェクトの作成・管理（CREATE2アドレス生成）
2. **クロスチェーン寄付**: Nexus SDKによる複数チェーンからの寄付受付
3. **PYUSD統合**: PayPal USDでの安定した寄付体験
4. **自動変換・集約**: トークンの自動変換とクロスチェーン集約
5. **管理ダッシュボード**: プロジェクト管理者向けリアルタイム管理画面
6. **統一アドレス**: すべてのチェーンで同一アドレスでの寄付受付
7. **レスポンシブデザイン**: モバイル・デスクトップ対応

## スマートコントラクト詳細

### DonationPool.sol (メインコントラクト)
**セキュリティ機能:**
- ReentrancyGuard: リエントランシー攻撃対策
- Ownable2Step: 安全なオーナー権限移譲
- カスタムエラー: ガス効率的なエラーハンドリング
- SafeERC20: ERC20トークンの安全な取り扱い

**主要メソッド:**
- `donateETH()`: ETH寄付受付
- `donate(token, amount)`: ERC20トークン寄付受付
- `withdrawFunds(token, amount)`: 資金出金
- `emergencyWithdrawETH()`: 緊急ETH出金
- `emergencyWithdrawToken(token)`: 緊急トークン出金
- `swapUsdcToPyusd(amount)`: USDC→PYUSD変換
- `initiateConversion(token, amount)`: Nexus変換開始
- `setConversionSink(sink)`: 変換先設定
- `setTargetToken(token)`: ターゲットトークン設定
- `getAllBalances()`: 全残高取得
- `getBalance(token)`: 特定トークン残高取得
- `balanceOf(token, account)`: アカウント別残高取得

### CREATE2Factory.sol
- 決定論的アドレス生成による統一アドレス実現
- 複数チェーンで同一アドレス展開

### テスト・モックコントラクト
- **PYUSDToken.sol**: PYUSD モックトークン
- **USDCToken.sol**: USDC モックトークン
- **ReentrantToken.sol**: リエントランシーテスト用
- **ExampleToken.sol**: 汎用テスト用ERC20

## フロントエンド実装詳細

### カスタムフック
- **useNexusSDK**: Nexus SDK統合・初期化
- **useNexusBalance**: 統一残高管理
- **useWalletConnection**: ウォレット接続状態管理
- **useErrorHandler**: アプリケーション全体のエラーハンドリング
- **useMediaQuery**: レスポンシブ対応

### コンポーネント構成
- **Atomic Design**: atoms/molecules/organisms 構成
- **Nexus統合**: 専用コンポーネント群
- **ウォレット接続**: RainbowKit統合コンポーネント
- **管理者機能**: 権限ガード・変換カード

### ページ構成
- **ホーム** (`/`): プロジェクト一覧・検索
- **プロジェクト作成** (`/create`): 新規プロジェクト作成フォーム
- **寄付実行** (`/donate/[projectId]`): 寄付インターフェース
- **管理ダッシュボード** (`/admin/[projectId]`): プロジェクト管理

## 技術的な特徴
- **CREATE2活用**: 決定論的アドレス生成による統一寄付アドレス
- **Nexus SDK統合**: Avail のクロスチェーンインフラ活用
- **TypeScript完全統合**: フロントエンド・コントラクト共に型安全
- **モダンツールチェーン**: Biome による統一的なコード品質管理
- **最新フレームワーク**: React 19, Next.js 15, Hardhat V3の採用
- **セキュリティファースト**: OpenZeppelin ベースのセキュアな実装
- **ガス最適化**: Solidity 0.8.28 + カスタムエラーによる効率的な実装

## 開発者体験
### Git Hooks統合
- **pre-commit**: format → lint 自動実行
- **pre-push**: typecheck → check 自動実行
- **simple-git-hooks**: 軽量なGitフック管理

### 開発フロー
- **Hot Reload**: Next.js 15高速開発サーバー
- **型安全性**: TypeScript 5.7.2/5.8.0完全統合
- **テスト**: Node.js組み込みテストランナー + Viem
- **デプロイ**: Hardhat Ignition宣言的デプロイメント

## テスト・セキュリティ
### テストスイート
- **DonationPool.test.ts/.js**: メインコントラクトテスト
- **SecurityFeatures.test.js**: セキュリティ機能テスト
- **BalanceManagement.test.js**: 残高管理テスト
- **USDCtoPYUSD.test.ts**: USDC-PYUSD変換テスト
- **CREATE2Factory.test.js**: CREATE2ファクトリテスト

### セキュリティ対策
- **リエントランシー対策**: ReentrancyGuard使用
- **アクセス制御**: Ownable2Step使用
- **安全なトークン操作**: SafeERC20使用
- **エラーハンドリング**: カスタムエラーによる詳細情報

## プロダクトのゴール
**寄付者体験の究極的な向上**: どのチェーンのどんなトークンを持っていても、単一の統一アドレスに送金するだけでシームレスに寄付が完了

**運営者体験の革新**: すべての寄付を指定した単一のトークン・チェーンで一元的に、かつ安全に受け取ることができ、資産管理や税務上の複雑さが解消

## ETHGlobal 2025対応
- **開催期間**: 2025年10月10日-31日のオンラインハッカソン
- **現在進行**: 2025年10月26日時点で開発進行中
- **審査員対応**: わかりやすい英語コミットメッセージ
- **プライズ要件**: Avail Nexus SDK、PYUSD、Hardhat V3の完全統合
- **デモ準備**: 動作する本格的なクロスチェーン寄付システム

## 将来展望
- **マルチシグ統合**: Lit Protocol連携によるマルチシグ対応
- **ガバナンストークン**: DAOによる分散型ガバナンス
- **高度な変換**: より多くのDEX/ブリッジプロトコル統合
- **プライバシー強化**: zk-SNARK等を活用した匿名寄付
- **レポート機能**: 寄付証明書・税務レポート自動生成