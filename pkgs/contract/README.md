# CrossDonate Smart Contracts

CrossDonate プロジェクトのスマートコントラクト実装です。
CREATE2 と Avail Nexus SDK を用いて **マルチチェーンで統一アドレス**を実現し、複数チェーン・複数トークンからの寄付を安全に受け付け、統一的に管理します。

- Solidity: `^0.8.28`（最適化有効のプロファイル）
- 対応ネットワーク（例）: `sepolia`, `arbitrumSepolia`

---

## 概要

CrossDonate は、寄付の受付から残高・統計の確認、緊急時の資金退避までをカバーします。
CREATE2 により **チェーンを跨いでも同一のデプロイアドレス**を維持できます。

---

## 機能

### DonationPool
- **ETH 寄付**: 直接 ETH の寄付を受け取る
- **ERC20 寄付**: サポート済み ERC20 トークンの寄付を受け取る
- **寄付管理**: 寄付額の制限 / 有効・無効切り替え
- **残高管理**: 包括的な残高確認と統計機能
- **セキュリティ**: OpenZeppelin ライブラリによる堅牢実装
- **緊急機能**: 緊急時の資金引き出し機能（ETH / ERC20）

### CREATE2Factory
- **統一アドレス**: CREATE2 を用いたマルチチェーン同一アドレス
- **事前計算**: デプロイ前にアドレスを算出
- **プール管理**: デプロイ済みプールの管理・追跡
- **マルチチェーン対応**: 複数チェーンで一貫したアドレス生成

---

## 要件 / Requirements

- Node.js 22+
- PNPM 10+
- 環境変数（`.env` か CI 上のシークレットに設定）
  - `SEPOLIA_RPC_URL`
  - `ARBITRUM_SEPOLIA_RPC_URL`
  - `PRIVATE_KEY`（デプロイ/テストに用いるアカウント）

> 参考: ルートにある `.env.example` を元に `pkgs/contract/.env` を作成してください。

---

## インストール

**モノレポのルート**で実行:

```sh
pnpm install
```

## スクリプト系

### donate

Aribitrum sepolia 上の USDCを指定する場合

```bash
pnpm contract run donate --network arbitrumSepolia
```

以下のようになっていればOK

```bash
========================= [START] =========================
Sender address: 0x51908f598a5e0d8f1a3babfa6df76f9704dad072
ChainID: 421614
Donating to contract DonationPoolModule#DonationPool at address: 0x677fA3F54bab17C4654A534683F1CEab94278632
Approve tx receipt: 0x2c46a276a69045ab869ff0065077e68a8c922c60e6822eba73a38c0e046883f6
Donate tx receipt: 0xd273a484ae10795b2833ca6097f3a0038f6ca8455254ad1688533270740dd4b4
========================= [END] =========================
```

### swapUsdcToPyusd

```bash
pnpm contract run swapUsdcToPyusd --network arbitrumSepolia
```

以下のようになればOK!

```bash
========================= [START] =========================
Sender address: 0x51908f598a5e0d8f1a3babfa6df76f9704dad072
ChainID: 421614
Donating to contract DonationPoolModule#DonationPool at address: 0x677fA3F54bab17C4654A534683F1CEab94278632
Swap tx receipt: 0x4e6cd4713ca135da3521bb1ac37e2b569842774d9dc4b2d1555ce2936fb735ae
========================= [END] =========================
```
