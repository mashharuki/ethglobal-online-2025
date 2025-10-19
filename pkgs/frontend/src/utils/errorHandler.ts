import type { ApiError, RetryConfig } from '@/types';

/**
 * エラーメッセージを生成する関数
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('timeout')) {
      return 'Nexus SDK API timeout, showing demo data';
    } else if (error.message.includes('Failed to fetch')) {
      return 'Network error - Nexus SDK API unavailable, showing demo data';
    } else {
      return `Nexus SDK error: ${error.message}, showing demo data`;
    }
  }
  return 'Nexus SDK temporarily unavailable, showing demo data';
}

/**
 * リトライロジックを実行する関数
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = { maxRetries: 3, retryDelay: 1000 }
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === config.maxRetries) {
        throw error;
      }

      const delay = config.retryDelay * (config.backoffMultiplier || 1) ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * APIエラーを作成する関数
 */
export function createApiError(
  message: string,
  code?: string | number,
  details?: Record<string, unknown>
): ApiError {
  return {
    message,
    code,
    details,
  };
}
