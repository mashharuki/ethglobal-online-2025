import { useMedia } from 'react-use';

/**
 * メディアクエリを使用して画面サイズを判定するカスタムフック
 * Tailwind CSSのブレークポイントと一致させています
 */
export function useMediaQuery() {
  const isMobile = useMedia('(max-width: 767px)'); // sm未満
  const isTablet = useMedia('(min-width: 768px)'); // sm以上
  const isDesktop = useMedia('(min-width: 1024px)'); // lg以上
  const isLargeDesktop = useMedia('(min-width: 1280px)'); // xl以上

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
}
