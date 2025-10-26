# My Nexus App

## 環境設定

### 環境変数の設定

`.env.local`ファイルを作成して以下の環境変数を設定してください：

```bash
# ネットワーク設定（mainnetに設定済み）
NEXT_PUBLIC_NETWORK=mainnet

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
```

### ネットワーク設定

アプリケーションは現在mainnetに設定されています。以下のチェーンがサポートされています：

- Ethereum Mainnet
- Base
- Arbitrum
- Optimism
- Polygon

### 開発サーバーの起動

```bash
pnpm dev
```
