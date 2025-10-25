# 設計パターン・ガイドライン

## アーキテクチャパターン
### 1. モノレポ設計
- **pnpmワークスペース**: パッケージ間の依存関係管理
- **共通設定**: Biome、TypeScript設定の統一
- **独立性**: フロントエンドとコントラクトの独立開発

### 2. フロントエンド設計パターン
#### Atomic Design
```
atoms/      → 最小単位のUIコンポーネント (Button, Input)
molecules/  → atomsの組み合わせ (SearchBox, Card)
organisms/  → molecules/atomsの複雑な組み合わせ
```

#### React パターン
- **Custom Hooks**: ロジックの再利用 (useNexusSDK, useWalletConnection)
- **Context + Provider**: グローバル状態管理 (Web3Provider)
- **Error Boundaries**: エラーハンドリングの境界
- **Compound Components**: 複雑なUIの構造化

#### 状態管理パターン
- **React Query**: サーバー状態とキャッシュ管理
- **useState/useReducer**: ローカル状態管理
- **Context**: グローバル状態（認証、テーマ等）

### 3. スマートコントラクト設計パターン
#### セキュリティパターン
- **Checks-Effects-Interactions**: 状態変更の安全な順序
- **ReentrancyGuard**: リエントランシー攻撃防止
- **Access Control**: Ownable による権限管理
- **Pull over Push**: 安全な資金転送

#### OpenZeppelin活用
- **IERC20 + SafeERC20**: 安全なトークン操作
- **Ownable**: 所有権管理
- **ReentrancyGuard**: 再入防止

## コーディングガイドライン

### 1. エラーハンドリング
#### TypeScript
```typescript
// カスタムエラータイプ
type AppError = {
  code: string;
  message: string;
  details?: unknown;
};

// エラーハンドリングフック
const { handleError } = useErrorHandler();
```

#### Solidity
```solidity
// カスタムエラー使用
error ZeroAddress();
error ZeroAmount();
error UnsupportedToken();

// ガード条件
if (amount == 0) revert ZeroAmount();
```

### 2. 型安全性
#### 厳密な型定義
```typescript
// 明示的な型定義
interface Project {
  id: string;
  name: string;
  unifiedAddress: `0x${string}`; // アドレス型
}

// ユニオン型の活用
type TransactionStatus = 'pending' | 'confirmed' | 'failed';
```

### 3. 非同期処理パターン
#### React Query活用
```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ['project', projectId],
  queryFn: () => fetchProject(projectId),
});
```

#### エラー境界
```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <ProjectDetails />
</ErrorBoundary>
```

### 4. パフォーマンス最適化
#### React最適化
- **useMemo/useCallback**: 不要な再計算・再生成防止
- **React.memo**: コンポーネント再レンダリング制御
- **Code Splitting**: 動的インポートによる分割

#### Web3最適化
- **バッチクエリ**: 複数のブロックチェーンクエリの最適化
- **キャッシュ戦略**: React Queryによる賢いキャッシュ
- **Connection Pooling**: RPC接続の効率化

## 特殊要件・制約

### 1. ETHGlobal要件対応
#### Nexus SDK統合
- **統一アドレス**: クロスチェーン対応の実装
- **自動変換**: トークン変換機能
- **Widget活用**: Nexus Widgetsの適切な使用

#### Hardhat V3活用
- **Ignition**: デプロイメント管理
- **Viem統合**: 型安全なEthereumクライアント
- **テスト**: Node.js組み込みテストランナー使用

### 2. セキュリティ要件
#### 入力値検証
```solidity
modifier validAddress(address addr) {
    if (addr == address(0)) revert ZeroAddress();
    _;
}

modifier validAmount(uint256 amount) {
    if (amount == 0) revert ZeroAmount();
    _;
}
```

#### フロントエンド検証
```typescript
const validateDonationAmount = (amount: string): boolean => {
  const parsed = parseFloat(amount);
  return parsed > 0 && parsed <= MAX_DONATION_AMOUNT;
};
```

### 3. ユーザビリティ要件
#### プログレッシブエンハンスメント
- **段階的機能**: Web3機能の段階的提供
- **フォールバック**: ウォレット未接続時の代替UI
- **レスポンシブ**: モバイル対応の確保

#### アクセシビリティ
- **Radix UI**: アクセシブルなUI基盤
- **セマンティックHTML**: 意味のあるマークアップ
- **キーボードナビゲーション**: キーボード操作対応