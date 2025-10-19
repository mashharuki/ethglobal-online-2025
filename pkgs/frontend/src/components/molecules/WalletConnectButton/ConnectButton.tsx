import type { ResponsiveConfig } from '@/types';
import { getResponsiveButtonStyles, getResponsiveText } from '@/utils/responsive';

interface ConnectButtonProps {
  onConnect: () => void;
  config: ResponsiveConfig;
}

export function ConnectButton({ onConnect, config }: ConnectButtonProps) {
  const styles = getResponsiveButtonStyles(config);
  const text = getResponsiveText({ full: 'ウォレットを接続', short: 'ウォレット接続' }, config);

  return (
    <button
      onClick={onConnect}
      type="button"
      className="bg-gradient-to-r from-primary to-accent text-white px-4 tablet:px-12 py-2 tablet:py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 glow-primary"
      style={styles.button}
    >
      <span className={text.full ? 'inline' : 'hidden'}>{text.full}</span>
      <span className={text.short ? 'inline' : 'hidden'}>{text.short}</span>
    </button>
  );
}
