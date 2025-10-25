# コードスタイル・規約

## 全般的な規約
### ファイル形式
- **TypeScript**: 全てのJavaScript系ファイルはTypeScript使用
- **ESModule**: package.jsonで"type": "module"指定
- **エンコーディング**: UTF-8

### 命名規約
#### TypeScript/JavaScript
- **コンポーネント**: PascalCase (例: `HomePage`, `DonationPool`)
- **関数・変数**: camelCase (例: `handleClick`, `totalDonations`)
- **定数**: UPPER_SNAKE_CASE (例: `SEPOLIA_RPC_URL`)
- **ファイル名**: 
  - コンポーネント: PascalCase.tsx (例: `Button.tsx`)
  - ユーティリティ: camelCase.ts (例: `errorHandler.ts`)

#### Solidity
- **コントラクト**: PascalCase (例: `DonationPool`)
- **関数**: camelCase (例: `setSupportedToken`)
- **変数**: camelCase
- **定数**: UPPER_SNAKE_CASE
- **プライベート変数**: アンダースコアプレフィックス (例: `_balances`)

### ディレクトリ構造規約
#### フロントエンド (Atomic Design)
```
src/
├── components/
│   ├── atoms/          # 基本UI要素
│   ├── molecules/      # 複合コンポーネント
│   ├── organisms/      # 複雑なコンポーネント
│   ├── nexus/          # Nexus SDK関連
│   └── providers/      # Context Providers
├── hooks/              # カスタムフック
├── types/              # 型定義
├── utils/              # ユーティリティ関数
└── mockdatas/          # モックデータ
```

## Biome設定
### フォーマット規則
- **インデント**: スペース (indentStyle: "space")
- **推奨ルール**: 有効 (rules.recommended: true)
- **テストファイル**: リンター無効 (contract/test/**)

### 除外設定
- **未知ファイル**: 無視しない (ignoreUnknown: false)
- **対象**: すべてのファイル (includes: ["**/*"])

## コメント・ドキュメント規約
### TypeScript
- **JSDoc**: 複雑な関数に対して使用
- **インライン**: 複雑なロジックに説明コメント
- **TODO**: 将来の改善点を明記

### Solidity
- **NatSpec**: すべてのpublic/external関数に使用
- **@title**: コントラクトのタイトル
- **@notice**: 機能説明
- **@param**: パラメータ説明
- **@dev**: 開発者向け詳細

## Import/Export規約
### TypeScript
- **絶対パス**: `@/` prefixでsrcからの絶対パス
- **Named Export**: 基本的にnamed exportを使用
- **Default Export**: Reactコンポーネントのみ

### 依存関係順序
1. 外部ライブラリ
2. 内部コンポーネント（@/から開始）
3. 相対パス

## エラーハンドリング規約
### TypeScript
- **型安全**: 厳密な型チェック
- **エラー境界**: ErrorBoundaryコンポーネント使用
- **非同期**: try-catch + エラー状態管理

### Solidity
- **カスタムエラー**: revertではなくcustom error使用
- **ガード条件**: 関数最上部で入力検証
- **リエントランシー**: ReentrancyGuard使用