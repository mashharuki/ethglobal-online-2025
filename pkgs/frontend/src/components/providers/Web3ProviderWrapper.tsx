'use client';

import Web3Provider from '@/providers/Web3Provider';
import { SDKInitializationProvider } from '@/contexts/SDKInitializationContext';
import type { ReactNode } from 'react';

interface Web3ProviderWrapperProps {
  children: ReactNode;
}

export default function Web3ProviderWrapper({ children }: Web3ProviderWrapperProps) {
  return (
    <Web3Provider>
      <SDKInitializationProvider>{children}</SDKInitializationProvider>
    </Web3Provider>
  );
}
