// 管理者ページ用の取引履歴データ
export const mockTransactions = [
  {
    type: 'donation',
    from: '0x1234...5678',
    amount: '0.5 ETH',
    chain: 'Sepolia',
    timestamp: '2025-01-10 14:30',
    status: 'confirmed',
  },
  {
    type: 'conversion',
    from: 'System',
    amount: '2.0 ETH → 5,000 USDC',
    chain: 'Arbitrum Sepolia',
    timestamp: '2025-01-10 12:00',
    status: 'completed',
  },
  {
    type: 'donation',
    from: '0x8765...4321',
    amount: '100 USDC',
    chain: 'Arbitrum Sepolia',
    timestamp: '2025-01-10 11:45',
    status: 'confirmed',
  },
  {
    type: 'withdrawal',
    from: 'Admin',
    amount: '2,000 USDC',
    chain: 'Arbitrum Sepolia',
    timestamp: '2025-01-09 16:20',
    status: 'completed',
  },
];

// 寄付ページ用の最近の寄付履歴
export const mockRecentDonations = [
  {
    donor: '0x1234...5678',
    amount: '0.5 ETH',
    chain: 'Sepolia',
    timestamp: '2分前',
    txHash: '0xabcd...efgh',
  },
  {
    donor: '0x8765...4321',
    amount: '100 USDC',
    chain: 'Arbitrum Sepolia',
    timestamp: '15分前',
    txHash: '0xijkl...mnop',
  },
  {
    donor: '0x9876...1234',
    amount: '50 PYUSD',
    chain: 'Sepolia',
    timestamp: '1時間前',
    txHash: '0xqrst...uvwx',
  },
];
