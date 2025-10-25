# CrossDonate - ETHGlobal Online 2025 プロジェクト概要

## プロジェクトの目的
CrossDonateは、Web3寄付の断片化問題を解決する革新的なソリューションです。

### 核心的な価値提案
- **統一寄付アドレス**: 任意のチェーン・トークンから単一の統一アドレスに送金
- **自動変換・集約**: 自動的に指定トークン・チェーンに変換・集約される
- **クロスチェーン対応**: 複数のブロックチェーンから寄付を受け付け

### 対象となるプライズ
1. **Avail Prize**: Nexus SDKを使用
2. **PayPal Prize**: PYUSDを使用
3. **Hardhat Prize**: Hardhat V3を使用

## アーキテクチャ
モノレポ構成で、以下の2つの主要パッケージから構成：

### pkgs/frontend
- Next.js 15.0.0ベースのフロントエンド
- React 19.0.0使用
- Avail Nexus SDK統合 (@avail-project/nexus-core, @avail-project/nexus-widgets)
- RainbowKit + Wagmi でウォレット接続
- Tailwind CSS v4でスタイリング

### pkgs/contract
- Hardhat v3ベースのスマートコントラクト
- Solidity 0.8.28
- OpenZeppelin契約を使用
- セキュリティ機能（ReentrancyGuard, Ownable）を実装

## 主要機能
1. **プロジェクト作成**: 寄付プロジェクトの作成
2. **マルチチェーン寄付**: 複数チェーンからの寄付受付
3. **自動変換**: トークンの自動変換・集約
4. **管理画面**: プロジェクト管理者向けダッシュボード

## 技術的な特徴
- TypeScript統一環境
- pnpmワークスペース管理
- Biome使用（リンティング・フォーマット）
- セキュリティ重視の設計