# コードスタイル・規約 (2025年10月最新版)

## 全般的な規約
### ファイル・プロジェクト形式
- **TypeScript**: すべてのJavaScript系ファイルはTypeScript使用 (5.8.0)
- **ESModule**: package.jsonで\"type\": \"module\"指定 (全パッケージ)
- **エンコーディング**: UTF-8
- **改行コード**: LF (Unix形式)

### 命名規約
#### TypeScript/JavaScript/React
- **コンポーネント**: PascalCase (例: `HomePage`, `DonationWidget`)
- **関数・変数**: camelCase (例: `handleDonation`, `totalDonations`)
- **定数**: UPPER_SNAKE_CASE (例: `SEPOLIA_RPC_URL`, `MAX_DONATION_AMOUNT`)
- **型・インターフェース**: PascalCase (例: `ProjectType`, `NexusBalance`)
- **ファイル名**: 
  - Reactコンポーネント: PascalCase.tsx (例: `Button.tsx`, `DonationForm.tsx`)
  - ユーティリティ・フック: camelCase.ts (例: `useNexusSDK.ts`, `errorHandler.ts`)
  - 型定義: camelCase.ts (例: `project.ts`, `nexus.ts`)

#### Solidity
- **コントラクト**: PascalCase (例: `DonationPool`, `ExampleToken`)
- **関数**: camelCase (例: `setSupportedToken`, `withdrawDonations`)
- **変数**: camelCase (例: `totalDonated`, `supportedTokens`)
- **定数**: UPPER_SNAKE_CASE (例: `MAX_DONATION_AMOUNT`)
- **プライベート変数**: アンダースコアプレフィックス (例: `_balances`, `_owner`)
- **イベント**: PascalCase (例: `DonationReceived`, `TokenAdded`)
- **エラー**: PascalCase (例: `ZeroAddress`, `UnsupportedToken`)

## ディレクトリ構造規約
### フロントエンド (Atomic Design + Next.js App Router)
```
src/
├── components/
│   ├── atoms/          # 基本UI要素 (Button, Input, Card)
│   ├── molecules/      # 複合コンポーネント (SearchBox, TokenSelector)
│   ├── organisms/      # 複雑なコンポーネント (ProjectCard, DonationForm)
│   ├── nexus/          # Nexus SDK専用コンポーネント
│   └── providers/      # Context Providers (Web3Provider)
├── hooks/              # カスタムフック (useNexusSDK, useWalletConnection)
├── types/              # TypeScript型定義 (project.ts, nexus.ts)
├── utils/              # ユーティリティ関数 (web3/, errorHandler.ts)
├── providers/          # グローバルProviders
├── mockdatas/          # 開発用モックデータ
└── themes/             # テーマ・スタイル設定
```

### コントラクト (Hardhat V3 + セキュリティパターン)
```
contracts/
├── interfaces/         # インターフェース定義 (IDonationPool.sol)
├── mocks/              # テスト用モック (ReentrantToken.sol)
└── *.sol               # メインコントラクト (DonationPool.sol)
```

## Biome設定準拠
### フォーマット・リント規則
- **インデント**: スペース2個 (indentStyle: \"space\", indentWidth: 2)
- **推奨ルール**: 有効 (rules.recommended: true)
- **セミコロン**: 自動挿入
- **クォート**: ダブルクォート優先
- **末尾カンマ**: 可能な場合は追加

### Biome除外設定
- **テストファイル**: リンター部分無効 (contract/test/**)
- **アーティファクト**: 完全無視 (artifacts/, cache/, node_modules/)
- **未知ファイル**: 処理対象 (ignoreUnknown: false)

## コメント・ドキュメント規約
### TypeScript (JSDoc準拠)
```typescript
/**
 * Nexus SDKを使用してクロスチェーン寄付を実行する
 * @param projectId - 寄付先プロジェクトID
 * @param amount - 寄付金額 (Wei単位)
 * @param sourceChain - 送金元チェーンID
 * @returns トランザクションハッシュ
 */
const executeCrossChainDonation = async (
  projectId: string,
  amount: bigint,
  sourceChain: number
): Promise<`0x${string}`> => {
  // 実装...
};
```

### Solidity (NatSpec準拠)
```solidity
/**
 * @title DonationPool - クロスチェーン寄付プール
 * @notice PYUSD対応のクロスチェーン寄付機能を提供
 * @dev OpenZeppelin ReentrancyGuard + Ownable使用
 */
contract DonationPool is ReentrancyGuard, Ownable {
    /**
     * @notice 新しい寄付を受け付ける
     * @param projectId プロジェクトの一意識別子
     * @param token 寄付に使用するトークンアドレス
     * @param amount 寄付金額 (最小1wei以上)
     * @dev ZeroAddress, ZeroAmount, UnsupportedTokenエラーの可能性
     */
    function donate(
        bytes32 projectId,
        address token,
        uint256 amount
    ) external nonReentrant validAmount(amount) {
        // 実装...
    }
}
```

## Import/Export規約
### TypeScript モジュール管理
```typescript
// 1. 外部ライブラリ (アルファベット順)
import { useQuery } from "@tanstack/react-query";
import { useAccount, useConnect } from "wagmi";

// 2. 内部コンポーネント (@/ prefix使用)
import { Button } from "@/components/atoms/Button";
import { useNexusSDK } from "@/hooks/useNexusSDK";

// 3. 相対パス (最小限に抑制)
import type { ProjectType } from "./types";

// Named Export推奨 (Reactコンポーネント以外)
export const calculateDonationFee = (amount: bigint): bigint => {
  return amount / 100n; // 1%手数料
};

// Default Export (Reactコンポーネントのみ)
export default function DonationPage() {
  return <div>...</div>;
}
```

## エラーハンドリング規約
### TypeScript エラー管理
```typescript
// カスタムエラー型定義
type DonationError = {
  code: 'INSUFFICIENT_BALANCE' | 'NETWORK_ERROR' | 'USER_REJECTED';
  message: string;
  details?: unknown;
};

// エラーハンドリングパターン
const { data, error, isLoading } = useQuery({
  queryKey: ['donation', projectId],
  queryFn: async () => {
    try {
      return await executeDonation(projectId);
    } catch (err) {
      throw createDonationError('NETWORK_ERROR', 'Failed to execute donation', err);
    }
  },
});
```

### Solidity エラーハンドリング
```solidity
// カスタムエラー定義 (revert string より効率的)
error ZeroAddress();
error ZeroAmount();
error UnsupportedToken(address token);
error InsufficientBalance(uint256 required, uint256 available);

// ガード条件の実装
modifier validAddress(address addr) {
    if (addr == address(0)) revert ZeroAddress();
    _;
}

modifier validAmount(uint256 amount) {
    if (amount == 0) revert ZeroAmount();
    _;
}
```

## TypeScript厳密性設定
### 型安全性の確保
```typescript
// 厳密な型定義
interface Project {
  readonly id: string;
  readonly name: string;
  readonly unifiedAddress: `0x${string}`; // アドレス型強制
  readonly supportedTokens: readonly `0x${string}`[];
}

// ユニオン型の活用
type TransactionStatus = 'pending' | 'confirmed' | 'failed';
type ChainId = 1 | 11155111 | 421614; // Mainnet, Sepolia, Arbitrum Sepolia

// Non-null assertion回避
const safeGetProject = (id: string): Project | null => {
  return projects.find(p => p.id === id) ?? null;
};
```

## React/Next.js固有規約
### コンポーネント設計
```typescript
// Props型定義 (interface推奨)
interface ButtonProps {
  readonly children: React.ReactNode;
  readonly variant?: 'primary' | 'secondary';
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

// フォワードレフ + 型安全性
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant }))} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```