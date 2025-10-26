import type { ResponsiveConfig } from "@/types";
import { getResponsiveButtonStyles, getResponsiveText } from "@/utils/responsive";

interface UnsupportedChainButtonProps {
  onSwitchChain: () => void;
  config: ResponsiveConfig;
}

export function UnsupportedChainButton({ onSwitchChain, config }: UnsupportedChainButtonProps) {
  const styles = getResponsiveButtonStyles(config);
  const text = getResponsiveText({ full: "間違ったネットワーク", short: "ネットワーク" }, config);

  return (
    <button
      onClick={onSwitchChain}
      type="button"
      className="bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
      style={styles.button}
    >
      <span className={text.full ? "inline" : "hidden"}>{text.full}</span>
      <span className={text.short ? "inline" : "hidden"}>{text.short}</span>
    </button>
  );
}
