# CrossDonate - ETHGlobal Online 2025 プロジェクト概要

## プロジェクトの目的
CrossDonateは、Web3寄付の断片化問題を解決する革新的なクロスチェーン寄付プラットフォームです。

### 核心的な価値提案
- **統一寄付アドレス**: 任意のチェーン・トークンから単一の統一アドレスに送金
- **自動変換・集約**: Avail Nexus SDKによる自動的なトークン変換・集約
- **クロスチェーン対応**: 複数のブロックチェーン間での寄付受付・処理
- **PYUSD統合**: PayPalのステーブルコインPYUSDを活用した安定した寄付体験

### 対象となるETHGlobalプライズ
1. **Avail Prize**: Nexus SDK (@avail-project/nexus-core, @avail-project/nexus-widgets) を使用
2. **PayPal Prize**: PYUSD (PayPal USD) ステーブルコインを統合
3. **Hardhat Prize**: Hardhat V3 (3.0.7) + Viem統合を使用

## アーキテクチャ
pnpmワークスペースベースのモノレポ構成：

### pkgs/frontend
- **Next.js 15.0.0** + **React 19.0.0** (最新版)
- **Avail Nexus SDK統合**: クロスチェーン機能の実現
- **RainbowKit 2.2.8 + Wagmi 2.17.2**: 最新のウォレット接続
- **Tailwind CSS 4.0.6**: 最新版でのスタイリング
- **React Query 5.90.1**: サーバー状態管理とキャッシュ

### pkgs/contract
- **Hardhat 3.0.7** (V3最新版) + **Viem 2.30.0**統合
- **Solidity 0.8.28** + **OpenZeppelin 5.0.0**
- **Hardhat Ignition 3.0.0**: 本格的なデプロイメント管理
- セキュリティ重視の設計 (ReentrancyGuard, Ownable, Custom Errors)

## 主要機能
1. **プロジェクト作成**: 寄付プロジェクトの作成・管理
2. **クロスチェーン寄付**: Nexus SDKによる複数チェーンからの寄付受付
3. **PYUSD統合**: PayPal USDでの安定した寄付体験
4. **自動変換・集約**: トークンの自動変換とクロスチェーン集約
5. **管理ダッシュボード**: プロジェクト管理者向けリアルタイム管理画面

## 技術的な特徴
- **TypeScript完全統合**: フロントエンド・コントラクト共に型安全
- **モダンツールチェーン**: Biome 2.2.6によるリント・フォーマット統一
- **最新フレームワーク**: React 19, Next.js 15, Hardhat V3の採用
- **セキュリティファースト**: OpenZeppelinベースのセキュアな実装
- **開発者体験重視**: 高速ビルド、型安全性、自動化された品質管理

## ETHGlobal 2025対応
- **開催期間**: 2025年10月10日-31日のオンラインハッカソン
- **審査員対応**: わかりやすい英語コミットメッセージ
- **プライズ要件**: Avail Nexus SDK、PYUSD、Hardhat V3の完全統合
- **デモ準備**: 動作する本格的なクロスチェーン寄付システム