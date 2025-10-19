import type { Project } from '@/types/project';

// ホームページ用のプロジェクト一覧
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: '海洋プラスチック汚染解決プロジェクト',
    description: '海洋プラスチック汚染の解決に向けた革新的な技術開発と普及活動を支援します。',
    unifiedAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    targetToken: 'USDC',
    targetChain: 'Arbitrum Sepolia',
    totalDonations: '$32,450',
    donorCount: 247,
    chains: ['Ethereum', 'Polygon', 'BSC'],
  },
  {
    id: 'project-2',
    name: '教育格差解消プロジェクト',
    description: '世界中の子どもたちに質の高い教育を提供するための支援活動です。',
    unifiedAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    targetToken: 'USDC',
    targetChain: 'Arbitrum Sepolia',
    totalDonations: '$67,890',
    donorCount: 189,
    chains: ['Ethereum', 'Arbitrum', 'Optimism'],
  },
  {
    id: 'project-3',
    name: '医療アクセス向上プロジェクト',
    description: '医療が不足している地域に質の高い医療サービスを提供する活動です。',
    unifiedAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    targetToken: 'USDC',
    targetChain: 'Arbitrum Sepolia',
    totalDonations: '$45,670',
    donorCount: 156,
    chains: ['Polygon', 'BSC', 'Avalanche'],
  },
];

// 個別プロジェクトの詳細データ
export const getProjectById = (projectId: string) => {
  const baseProject = {
    id: projectId,
    name: 'オープンソース開発支援',
    description: 'Web3エコシステムのオープンソースプロジェクトを支援',
    unifiedAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    targetToken: 'USDC',
    targetChain: 'Arbitrum Sepolia',
  };

  return baseProject;
};
