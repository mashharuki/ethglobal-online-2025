// プロジェクト関連の型
export interface Project {
  id: string;
  name: string;
  description: string;
  unifiedAddress: string;
  targetToken: string;
  targetChain: string;
  totalDonations?: string;
  donorCount?: number;
  chains?: string[];
}

// 寄付関連の型
export interface Donation {
  donor: string;
  amount: string;
  chain: string;
  timestamp: string;
  txHash?: string;
}

// 残高関連の型
export interface Balance {
  chain: string;
  token: string;
  amount: string;
  usdValue: number;
}

// 取引履歴の型
export interface Transaction {
  type: 'donation' | 'conversion' | 'withdrawal';
  from: string;
  amount: string;
  chain: string;
  timestamp: string;
  status: 'confirmed' | 'completed' | 'pending';
}
