# CrossDonate Smart Contracts

CrossDonateプロジェクトのスマートコントラクト実装です。

## 概要

CrossDonateは、CREATE2とAvail Nexus SDKを使用してマルチチェーンで統一アドレスを実現する寄付プラットフォームです。複数のトークンとチェーンからの寄付を受け取り、統一された管理を提供します。

## 機能

### DonationPool
- **ETH寄付**: 直接ETHの寄付を受け取る
- **ERC20寄付**: サポートされたERC20トークンの寄付を受け取る
- **寄付管理**: 寄付額の制限、有効/無効の切り替え
- **残高管理**: 包括的な残高確認と統計機能
- **セキュリティ**: OpenZeppelinライブラリを使用した安全な実装
- **緊急機能**: 緊急時の資金引き出し機能

### CREATE2Factory
- **統一アドレス**: CREATE2を使用したマルチチェーン同一アドレス
- **事前計算**: デプロイ前のアドレス事前計算機能
- **プール管理**: デプロイ済みプールの管理と追跡
- **マルチチェーン対応**: 複数チェーンでの一貫したアドレス生成

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### 環境変数の設定

`.env.example`を参考に`.env`ファイルを作成し、必要な環境変数を設定してください。

### コンパイル

```bash
npx hardhat compile
```

### テスト実行

```bash
npx hardhat test
```

### デプロイ

```bash
# ローカルネットワーク
npx hardhat run scripts/deploy.js

# Sepoliaテストネット
npx hardhat run scripts/deploy.js --network sepolia

# Arbitrum Sepoliaテストネット
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

## コントラクト仕様

### DonationPool

#### 主要な状態変数

- `owner`: コントラクトの所有者
- `targetToken`: 目標トークン（集約先）
- `supportedTokens`: サポートされているトークンのマッピング
- `totalDonations`: 各トークンの総寄付額
- `donorContributions`: 寄付者の総寄付額

#### 主要な関数

- `donateETH()`: ETH寄付を受け取る
- `donate(address token, uint256 amount)`: ERC20トークン寄付を受け取る
- `setSupportedToken(address token, bool supported)`: サポートトークンを設定
- `updateDonationSettings()`: 寄付設定を更新
- `emergencyWithdrawETH()`: 緊急時のETH引き出し
- `emergencyWithdrawToken()`: 緊急時のERC20引き出し

#### イベント

- `ETHDonationReceived`: ETH寄付が受け取られた時
- `TokenDonationReceived`: ERC20寄付が受け取られた時
- `TokenSupported`: サポートトークンが変更された時
- `DonationSettingsUpdated`: 寄付設定が変更された時
- `TargetTokenUpdated`: 目標トークンが変更された時

### CREATE2Factory

#### 主要な状態変数

- `deployedPools`: デプロイ済みプールのマッピング
- `poolInfo`: プールの詳細情報
- `totalPools`: プールの総数
- `poolList`: プールのアドレスリスト

#### 主要な関数

- `deployPool(DeploymentParams)`: CREATE2を使用してプールをデプロイ
- `calculateAddress(bytes32 salt, address owner)`: アドレスを事前計算
- `calculateAddresses(bytes32[] salts, address[] owners)`: 複数アドレスを事前計算
- `getPoolInfo(address poolAddress)`: プールの詳細情報を取得
- `getActivePools()`: アクティブなプールのリストを取得
- `deactivatePool(address poolAddress)`: プールを無効化
- `reactivatePool(address poolAddress)`: プールを再アクティブ化

#### イベント

- `PoolDeployed`: プールがデプロイされた時
- `PoolDeactivated`: プールが無効化された時
- `PoolReactivated`: プールが再アクティブ化された時
- `AddressPrecalculated`: アドレスが事前計算された時

## セキュリティ

- **ReentrancyGuard**: リエントランシー攻撃の防止
- **Ownable**: アクセス制御
- **SafeERC20**: 安全なERC20操作
- **Address**: 安全なアドレス操作

## ライセンス

MIT
