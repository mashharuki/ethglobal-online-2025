'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface SDKInitializationContextType {
  isSDKInitializing: boolean;
  setIsSDKInitializing: (initializing: boolean) => void;
}

const SDKInitializationContext = createContext<SDKInitializationContextType | undefined>(undefined);

export function SDKInitializationProvider({ children }: { children: ReactNode }) {
  const [isSDKInitializing, setIsSDKInitializing] = useState(false);

  return (
    <SDKInitializationContext.Provider value={{ isSDKInitializing, setIsSDKInitializing }}>
      {children}
    </SDKInitializationContext.Provider>
  );
}

export function useSDKInitialization() {
  const context = useContext(SDKInitializationContext);
  if (context === undefined) {
    throw new Error('useSDKInitialization must be used within a SDKInitializationProvider');
  }
  return context;
}
