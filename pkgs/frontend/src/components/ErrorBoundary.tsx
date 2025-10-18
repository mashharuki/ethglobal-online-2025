'use client';

import React from 'react';
import { Button } from '@/components/atoms/Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
          <h2 className="text-xl font-semibold text-destructive mb-4">エラーが発生しました</h2>
          <p className="text-muted-foreground mb-6">
            {this.state.error?.message || '予期しないエラーが発生しました。'}
          </p>
          <Button onClick={this.resetError} variant="outline">
            再試行
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// デフォルトのフォールバックコンポーネント
export function DefaultErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
      <h2 className="text-xl font-semibold text-destructive mb-4">エラーが発生しました</h2>
      <p className="text-muted-foreground mb-6">
        {error.message || '予期しないエラーが発生しました。'}
      </p>
      <Button onClick={resetError} variant="outline">
        再試行
      </Button>
    </div>
  );
}
