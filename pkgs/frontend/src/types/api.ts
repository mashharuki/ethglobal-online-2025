// API関連の型定義

// API レスポンスの基本型
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// API エラーの型
export interface ApiError {
  message: string;
  code?: string | number;
  details?: Record<string, unknown>;
}

// ローディング状態の型
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// リトライ設定の型
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier?: number;
}
