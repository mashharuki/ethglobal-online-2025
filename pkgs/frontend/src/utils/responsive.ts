import type { ResponsiveConfig } from '@/types';

/**
 * レスポンシブなスタイルを生成するユーティリティ
 */
export function getResponsiveButtonStyles(config: ResponsiveConfig) {
  const { isTablet } = config;

  return {
    button: {
      minWidth: isTablet ? '150px' : 'auto',
      minHeight: isTablet ? '48px' : 'auto',
      fontSize: isTablet ? '1rem' : '0.75rem',
      padding: isTablet ? '12px 16px' : '8px 12px',
    },
    text: {
      full: isTablet ? 'inline' : 'hidden',
      short: isTablet ? 'hidden' : 'inline',
    },
    icon: {
      size: isTablet ? 20 : 14,
      margin: isTablet ? 4 : 2,
    },
    gap: isTablet ? '12px' : '4px',
  };
}

/**
 * レスポンシブなテキストを生成するユーティリティ
 */
export function getResponsiveText(text: { full: string; short: string }, config: ResponsiveConfig) {
  const { isTablet } = config;

  return {
    full: isTablet ? text.full : '',
    short: isTablet ? '' : text.short,
  };
}
