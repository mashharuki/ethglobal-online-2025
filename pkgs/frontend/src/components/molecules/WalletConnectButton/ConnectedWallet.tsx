import type { ResponsiveConfig, WalletInfo } from "@/types";
import { formatAddress, formatChainName } from "@/utils/addressFormatter";
import { getResponsiveButtonStyles, getResponsiveText } from "@/utils/responsive";
import Image from "next/image";

interface ConnectedWalletProps {
  walletInfo: WalletInfo;
  onSwitchChain: () => void;
  onOpenAccount: () => void;
  config: ResponsiveConfig;
}

export function ConnectedWallet({
  walletInfo,
  onSwitchChain,
  onOpenAccount,
  config,
}: ConnectedWalletProps) {
  const styles = getResponsiveButtonStyles(config);

  // フォーマットされたテキストを準備
  const formattedAddress = formatAddress(walletInfo.address);
  const formattedChainName = formatChainName(walletInfo.chain?.name);

  const chainText = getResponsiveText(
    { full: walletInfo.chain?.name || "Unknown", short: formattedChainName },
    config
  );
  const accountText = getResponsiveText(
    { full: formattedAddress, short: formattedAddress },
    config
  );

  return (
    <div className="flex items-center" style={{ gap: styles.gap }}>
      {/* チェーンボタン */}
      <button
        onClick={onSwitchChain}
        type="button"
        className="flex items-center bg-background border border-border rounded-lg hover:bg-accent/10 transition-colors"
        style={{
          gap: styles.gap,
          padding: styles.button.padding,
          fontSize: styles.button.fontSize,
          minHeight: styles.button.minHeight,
        }}
      >
        {walletInfo.chain?.hasIcon && (
          <div
            style={{
              background: walletInfo.chain.iconBackground,
              width: styles.icon.size,
              height: styles.icon.size,
              borderRadius: 999,
              overflow: "hidden",
              marginRight: styles.icon.margin,
            }}
          >
            {walletInfo.chain.iconUrl && (
              <Image
                width={styles.icon.size}
                height={styles.icon.size}
                src={walletInfo.chain.iconUrl}
                alt={walletInfo.chain.name ?? "Chain icon"}
              />
            )}
          </div>
        )}
        <span className={chainText.full ? "inline" : "hidden"}>{chainText.full}</span>
        <span className={chainText.short ? "inline" : "hidden"}>{chainText.short}</span>
      </button>

      {/* アカウントボタン */}
      <button
        onClick={onOpenAccount}
        type="button"
        className="bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 glow-primary truncate"
        style={{
          ...styles.button,
          maxWidth: config.isTablet ? "none" : "120px",
        }}
      >
        <span className={accountText.full ? "inline" : "hidden"}>{accountText.full}</span>
        <span className={accountText.short ? "inline" : "hidden"}>{accountText.short}</span>
      </button>
    </div>
  );
}
