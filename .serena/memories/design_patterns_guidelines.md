# 設計パターン・ガイドライン (2025年10月26日最新版)

## アーキテクチャパターン

### 1. モノレポ設計 (pnpm Workspace)
- **パッケージ分離**: フロントエンド・コントラクト独立開発
- **共通設定**: Biome、TypeScript設定統一
- **依存関係管理**: pnpm workspace効率的パッケージ管理
- **ビルド最適化**: パッケージ別ビルド・並列実行対応
- **Git Hooks統合**: simple-git-hooks による品質管理自動化

### 2. フロントエンド設計パターン
#### Atomic Design + Next.js 15 App Router
```
atoms/      → 基本UI要素 (Button, Input, Card, Dialog, Switch)
molecules/  → 複合コンポーネント (WalletConnectButton, ConnectWallet)
organisms/  → 複雑なコンポーネント (ProjectList, AdminPermissionGuard, DonatePageClient)
nexus/      → Nexus SDK専用コンポーネント (nexus.tsx, ViewUnifiedBalance)
providers/  → Context Providers (Web3ProviderWrapper)
```

#### React 19 + Next.js 15パターン
- **Server Components**: デフォルトでサーバーサイドレンダリング
- **Client Components**: "use client"ディレクティブで明示的指定
- **Server Actions**: フォーム送信・データ変更処理
- **Streaming**: React Suspenseによる段階的ロード
- **App Router**: file-based routing system

#### カスタムフック戦略
```typescript
// Web3統合フック
useNexusSDK()          // Nexus SDK操作・初期化
useNexusBalance()      // クロスチェーン残高管理
useWalletConnection()  // ウォレット接続状態
useErrorHandler()      // 統一エラーハンドリング

// UI・UXフック
useMediaQuery()        // レスポンシブ対応
```

#### 状態管理アーキテクチャ
- **TanStack Query**: サーバー状態・キャッシュ管理 (Web3データ) 5.90.1
- **Context API**: グローバルクライアント状態 (Web3状態)
- **React Hook Form**: フォーム状態・バリデーション
- **Wagmi**: Web3状態管理 (2.17.2)

### 3. スマートコントラクト設計パターン
#### セキュリティパターン (OpenZeppelin V5準拠)
```solidity
// 1. Checks-Effects-Interactions パターン
function donate(address token, uint256 amount) external nonReentrant {
    // 1. Checks (条件確認)
    if (amount == 0) revert ZeroAmount();
    if (token == address(0)) revert ZeroAddress();
    
    // 2. Effects (状態変更)
    tokenBalances[token] += amount;
    _trackToken(token);
    
    // 3. Interactions (外部呼び出し)
    IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    emit DonationReceived(msg.sender, token, amount);
}
```

#### OpenZeppelin活用パターン
- **ReentrancyGuard**: すべての資金移動関数に適用
- **Ownable2Step**: 安全なオーナー権限移譲
- **SafeERC20**: 安全なトークン操作
- **Custom Errors**: ガス効率的なエラーハンドリング

#### DonationPool.sol 主要メソッド設計
```solidity
// 寄付受付
function donateETH() external payable nonReentrant
function donate(address token, uint256 amount) external nonReentrant

// 資金管理
function withdrawFunds(address token, uint256 amount) external onlyOwner
function emergencyWithdrawETH() external onlyOwner
function emergencyWithdrawToken(address token) external onlyOwner

// PYUSD変換・Nexus統合
function swapUsdcToPyusd(uint256 amount) external onlyOwner
function initiateConversion(address token, uint256 amount) external onlyOwner
function setConversionSink(address sink) external onlyOwner
function setTargetToken(address token) external onlyOwner

// 残高管理
function getAllBalances() external view returns (address[] memory, uint256[] memory)
function getBalance(address token) external view returns (uint256)
function balanceOf(address token, address account) external view returns (uint256)
```

## 統合パターン

### 4. Nexus SDK統合設計
#### Nexus Core SDK統合
```typescript
// useNexusSDK フック
const useNexusSDK = () => {
  const [nexusSDK, setNexusSDK] = useState<NexusCore | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: walletClient } = useWalletClient();
  
  useEffect(() => {
    if (walletClient?.transport) {
      const sdk = new NexusCore({
        ethereumProvider: walletClient.transport
      });
      setNexusSDK(sdk);
      setIsInitialized(true);
    }
  }, [walletClient]);

  return { nexusSDK, isInitialized };
};
```

#### Nexus Widgets活用
```typescript
// ViewUnifiedBalance コンポーネント
import { ViewUnifiedBalance as NexusBalanceWidget } from '@avail-project/nexus-widgets';

const ViewUnifiedBalance = () => {
  const { address } = useAccount();
  
  return (
    <NexusBalanceWidget
      userAddress={address}
      config={{
        chains: [1, 11155111, 421614], // Mainnet, Sepolia, Arbitrum
        tokens: ['USDC', 'PYUSD', 'ETH'],
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
import { DonationPoolABI } from '@/utils/web3/abi';

const donationPool = getContract({
  address: DONATION_POOL_ADDRESS,
  abi: DonationPoolABI,
  client: publicClient
});

// 型安全な関数呼び出し
const totalBalance = await donationPool.read.getBalance([tokenAddress]);
```

#### Hardhat Ignition デプロイメント
```typescript
// ignition/modules/DonationPool.ts
export default buildModule("DonationPool", (m) => {
  const donationPool = m.contract("DonationPool");
  
  return { donationPool };
});
```

#### テスト統合 (Node.js test runner)
```typescript
// test/DonationPool.test.ts
import { test, describe } from 'node:test';
import assert from 'node:assert';
import hre from 'hardhat';

describe('DonationPool', () => {
  test('should accept ETH donations', async () => {
    const donationPool = await hre.viem.deployContract('DonationPool');
    
    const tx = await donationPool.write.donateETH([], {
      value: parseEther('1.0')
    });
    
    assert.ok(tx);
  });
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

// useErrorHandler フック
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

#### Solidity エラーハンドリング
```solidity
// カスタムエラー定義 (ガス効率的)
error ZeroAddress();
error ZeroAmount();
error UnsupportedToken(address token);
error InsufficientBalance(uint256 required, uint256 available);
error UnauthorizedAccess(address caller);

// モディファイア活用
modifier validAddress(address addr) {
    if (addr == address(0)) revert ZeroAddress();
    _;
}

modifier validAmount(uint256 amount) {
    if (amount == 0) revert ZeroAmount();
    _;
}

modifier supportedToken(address token) {
    if (!_isSupported[token]) revert UnsupportedToken(token);
    _;
}
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
// TanStack Query活用
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

## UI・UXパターン

### 8. レスポンシブデザイン (Tailwind CSS 4.0)
#### モバイルファーストアプローチ
```typescript
// useMediaQuery フック
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
};

// 使用例
const DonationCard = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <Card className={cn(
      'p-4',
      isMobile ? 'flex-col' : 'flex-row'
    )}>
      {/* コンテンツ */}
    </Card>
  );
};
```

#### Tailwind CSS 4.0活用
```css
/* globals.css */
@import "tailwindcss";

/* カスタムユーティリティ */
.glass-morphism {
  backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(17, 25, 40, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
}
```

### 9. アクセシビリティパターン
#### Radix UI活用
```typescript
// Radix UI コンポーネント活用
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';

const DonationDialog = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>寄付する</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title>寄付を実行</Dialog.Title>
          {/* フォームコンテンツ */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
```

## セキュリティ・品質パターン

### 10. 入力検証・サニタイゼーション
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
  } = useForm<z.infer<typeof DonationSchema>>();
};
```

### 11. 監査・モニタリングパターン
#### イベント設計 (DonationPool.sol)
```solidity
event DonationReceived(
    address indexed donor,
    address indexed token,
    uint256 amount
);

event ConversionInitiated(
    address indexed token,
    uint256 amount,
    address indexed sink
);

event FundsWithdrawn(
    address indexed token,
    uint256 amount,
    address indexed to
);
```

#### CREATE2 アドレス計算
```typescript
// utils/create2Address.ts
import { getCreate2Address, keccak256, encodePacked } from 'viem';

export const calculateCreate2Address = (
  factoryAddress: `0x${string}`,
  salt: `0x${string}`,
  bytecode: `0x${string}`
): `0x${string}` => {
  return getCreate2Address({
    from: factoryAddress,
    salt,
    bytecodeHash: keccak256(bytecode)
  });
};
```

## 開発者体験向上

### 12. Git Hooks統合
```json
// simple-git-hooks設定
{
  "simple-git-hooks": {
    "pre-commit": "pnpm -C pkgs/frontend format && pnpm -C pkgs/frontend lint",
    "pre-push": "pnpm -C pkgs/frontend typecheck && pnpm -C pkgs/frontend check"
  }
}
```

### 13. モックデータ・テストパターン
#### モックデータ構造
```typescript
// src/mockdatas/projects.ts
export const mockProjects: ProjectType[] = [
  {
    id: 'project-1',
    name: 'Environmental Conservation',
    description: 'Protecting forests and wildlife',
    unifiedAddress: '0x742d35Cc6bA78dcBbbd6CfE667CCb222',
    targetToken: 'PYUSD',
    totalDonated: parseEther('1500.0'),
    donorCount: 42
  }
];
```

#### テストコントラクト
```solidity
// contracts/mocks/PYUSDToken.sol
contract PYUSDToken is ERC20 {
    constructor() ERC20("PayPal USD", "PYUSD") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
```

この設計パターンにより、ETHGlobal 2025の要件（Avail Nexus SDK、PYUSD、Hardhat V3）を満たしながら、保守性・拡張性・セキュリティを確保した開発が可能です。