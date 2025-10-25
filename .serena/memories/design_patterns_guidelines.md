# 設計パターン・ガイドライン (2025年10月最新版)

## アーキテクチャパターン

### 1. モノレポ設計 (pnpm Workspace)
- **パッケージ分離**: フロントエンド・コントラクト独立開発
- **共通設定**: Biome、TypeScript設定統一
- **依存関係管理**: pnpm workspace効率的パッケージ管理
- **ビルド最適化**: パッケージ別ビルド・並列実行対応

### 2. フロントエンド設計パターン
#### Atomic Design + Next.js App Router
```
atoms/      → 基本UI要素 (Button, Input, Card)
molecules/  → 複合コンポーネント (TokenSelector, AddressInput)
organisms/  → 複雑なコンポーネント (DonationForm, ProjectCard)
templates/  → レイアウトテンプレート (未使用、App Routerが担当)
pages/      → App Router app/ディレクトリで代替
```

#### React 19 + Next.js 15パターン
- **Server Components**: デフォルトでサーバーサイドレンダリング
- **Client Components**: "use client"ディレクティブで明示的指定
- **Server Actions**: フォーム送信・データ変更処理
- **Streaming**: React Suspenseによる段階的ロード
- **Partial Prerendering**: 静的・動的コンテンツの最適な混在

#### カスタムフック戦略
```typescript
// Web3統合フック
useNexusSDK()          // Nexus SDK操作
useNexusBalance()      // クロスチェーン残高管理
useWalletConnection()  // ウォレット接続状態
useErrorHandler()      // 統一エラーハンドリング

// UI・UXフック
useMediaQuery()        // レスポンシブ対応
useLocalStorage()      // ローカル状態永続化
useDebounce()          // 入力遅延処理
```

#### 状態管理アーキテクチャ
- **React Query**: サーバー状態・キャッシュ管理 (Web3データ)
- **Zustand**: グローバルクライアント状態 (UI状態、設定)
- **Context + useReducer**: 複雑なローカル状態 (フォーム、多段階フロー)
- **React Hook Form**: フォーム状態・バリデーション

### 3. スマートコントラクト設計パターン
#### セキュリティパターン (OpenZeppelin V5準拠)
```solidity
// 1. Checks-Effects-Interactions パターン
function donate(address token, uint256 amount) external nonReentrant {
    // 1. Checks (条件確認)
    if (amount == 0) revert ZeroAmount();
    if (token == address(0)) revert ZeroAddress();
    
    // 2. Effects (状態変更)
    totalDonations[projectId] += amount;
    userDonations[msg.sender][projectId] += amount;
    
    // 3. Interactions (外部呼び出し)
    IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    emit DonationReceived(projectId, msg.sender, token, amount);
}
```

#### OpenZeppelin活用パターン
- **ReentrancyGuard**: すべての資金移動関数に適用
- **Ownable**: 管理機能の権限管理
- **SafeERC20**: 安全なトークン操作
- **Custom Errors**: ガス効率的なエラーハンドリング

#### PYUSD統合パターン
```solidity
// PayPal USD (PYUSD) 専用処理
contract PYUSDDonationPool {
    IERC20 public immutable PYUSD;
    
    constructor(address _pyusd) {
        PYUSD = IERC20(_pyusd);
    }
    
    function donatePYUSD(bytes32 projectId, uint256 amount) external {
        PYUSD.safeTransferFrom(msg.sender, address(this), amount);
        // 自動変換・処理ロジック
    }
}
```

## 統合パターン

### 4. Nexus SDK統合設計
#### クロスチェーン寄付フロー
```typescript
// 1. Nexus Balance確認
const { data: balances } = useNexusBalance();

// 2. クロスチェーン転送実行
const executeCrossChainDonation = async (
  sourceChain: number,
  targetChain: number,
  amount: bigint
) => {
  const nexus = useNexusCore();
  
  // Nexus SDKによる自動ルーティング
  const route = await nexus.getBestRoute({
    from: sourceChain,
    to: targetChain,
    amount,
    token: selectedToken
  });
  
  // トランザクション実行
  return await nexus.executeTransfer(route);
};
```

#### Nexus Widgets活用
```typescript
// Nexus公式ウィジェット統合
import { NexusBridgeWidget } from '@avail-project/nexus-widgets';

const DonationBridge = () => {
  return (
    <NexusBridgeWidget
      config={{
        chains: [1, 11155111, 421614], // Mainnet, Sepolia, Arbitrum
        tokens: ['USDC', 'PYUSD', 'ETH'],
        onSuccess: handleDonationSuccess,
        onError: handleDonationError
      }}
    />
  );
};
```

### 5. Hardhat V3 + Viem統合
#### 型安全なコントラクト操作
```typescript
// Viem + Hardhat V3生成型
import { getContract } from 'viem';
import { DonationPoolABI } from '../contracts/generated';

const donationPool = getContract({
  address: DONATION_POOL_ADDRESS,
  abi: DonationPoolABI,
  client: publicClient
});

// 型安全な関数呼び出し
const totalDonated = await donationPool.read.getTotalDonations([projectId]);
```

#### Hardhat Ignition デプロイメント
```typescript
// ignition/modules/DonationPool.ts
export default buildModule("DonationPool", (m) => {
  const pyusdAddress = m.getParameter("pyusdAddress");
  const owner = m.getParameter("owner");
  
  const donationPool = m.contract("DonationPool", [pyusdAddress, owner]);
  
  return { donationPool };
});
```

## エラーハンドリング・レジリエンス

### 6. 統一エラーハンドリング
#### TypeScript エラー管理
```typescript
// カスタムエラー体系
type DonationError = 
  | { code: 'INSUFFICIENT_BALANCE'; required: bigint; available: bigint }
  | { code: 'NETWORK_ERROR'; network: string; details: string }
  | { code: 'USER_REJECTED'; operation: string }
  | { code: 'CONTRACT_ERROR'; contract: string; method: string };

// エラーハンドリングフック
const useErrorHandler = () => {
  const handleError = useCallback((error: DonationError) => {
    switch (error.code) {
      case 'INSUFFICIENT_BALANCE':
        toast.error(`残高不足: ${formatEther(error.required)} 必要`);
        break;
      case 'USER_REJECTED':
        toast.warning('操作がキャンセルされました');
        break;
      default:
        toast.error('予期しないエラーが発生しました');
    }
  }, []);
  
  return { handleError };
};
```

#### リトライ・フォールバック戦略
```typescript
// React Query リトライ設定
const { data } = useQuery({
  queryKey: ['donation', projectId],
  queryFn: () => fetchDonationData(projectId),
  retry: (failureCount, error) => {
    // ネットワークエラーは3回までリトライ
    if (error instanceof NetworkError && failureCount < 3) return true;
    // ユーザーエラーはリトライしない
    if (error instanceof UserError) return false;
    return failureCount < 2;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
});
```

### 7. パフォーマンス最適化パターン
#### React最適化
```typescript
// メモ化による最適化
const ExpensiveComponent = React.memo(({ data, onAction }) => {
  const processedData = useMemo(() => 
    expensiveCalculation(data), [data]
  );
  
  const handleAction = useCallback((id: string) => 
    onAction(id), [onAction]
  );
  
  return <div>{/* 重い処理結果表示 */}</div>;
});

// Code Splitting
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const DonationWidget = lazy(() => import('./DonationWidget'));
```

#### Web3最適化
```typescript
// バッチリクエスト
const useMultiChainBalances = (addresses: string[]) => {
  return useQuery({
    queryKey: ['balances', addresses],
    queryFn: async () => {
      // 複数チェーンの残高を並列取得
      const promises = SUPPORTED_CHAINS.map(chain => 
        getBalances(chain, addresses)
      );
      return await Promise.allSettled(promises);
    },
    staleTime: 30000 // 30秒キャッシュ
  });
};
```

## セキュリティ・品質パターン

### 8. 入力検証・サニタイゼーション
#### フロントエンド検証
```typescript
import { z } from 'zod';

const DonationSchema = z.object({
  projectId: z.string().uuid(),
  amount: z.string().refine(
    (val) => parseFloat(val) > 0,
    "金額は0より大きい必要があります"
  ),
  token: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "無効なトークンアドレス")
});

const DonationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof DonationSchema>>({
    resolver: zodResolver(DonationSchema)
  });
};
```

#### コントラクト検証
```solidity
modifier validProjectId(bytes32 projectId) {
    if (projectId == bytes32(0)) revert InvalidProjectId();
    _;
}

modifier validAmount(uint256 amount) {
    if (amount == 0) revert ZeroAmount();
    if (amount > MAX_DONATION_AMOUNT) revert ExcessiveAmount();
    _;
}

modifier supportedToken(address token) {
    if (!_supportedTokens[token]) revert UnsupportedToken(token);
    _;
}
```

### 9. 監査・モニタリングパターン
#### イベント設計
```solidity
event DonationReceived(
    bytes32 indexed projectId,
    address indexed donor,
    address indexed token,
    uint256 amount,
    uint256 timestamp
);

event CrossChainTransferInitiated(
    bytes32 indexed transferId,
    uint256 sourceChain,
    uint256 targetChain,
    address token,
    uint256 amount
);
```

#### ログ・トレーシング
```typescript
// 構造化ログ
const logger = {
  donation: (projectId: string, amount: bigint, txHash: string) => {
    console.log('DONATION_EXECUTED', {
      projectId,
      amount: amount.toString(),
      txHash,
      timestamp: Date.now()
    });
  }
};
```