'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { cn } from '@/utils/utils';

export default function ConnectWallet() {
  const { status } = useAccount();

  return (
    <div
      className={cn(
        'max-w-md mx-auto p-4 flex items-center justify-center',
        status === 'connected' && 'hidden'
      )}
    >
      <ConnectButton />
    </div>
  );
}
