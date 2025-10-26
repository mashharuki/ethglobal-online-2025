/**
 * アドレスを短縮形式にフォーマットする関数
 * @param address - フォーマットするアドレス
 * @param startLength - 先頭から表示する文字数（デフォルト: 6）
 * @param endLength - 末尾から表示する文字数（デフォルト: 4）
 * @returns フォーマットされたアドレス（例: "0x1234...5678"）
 */
export function formatAddress(address: string | undefined, startLength = 6, endLength = 4): string {
  if (!address) return "";

  if (address.length <= startLength + endLength) {
    return address;
  }

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * チェーン名を短縮形式にフォーマットする関数
 * @param chainName - フォーマットするチェーン名
 * @returns フォーマットされたチェーン名（最初の単語のみ）
 */
export function formatChainName(chainName: string | undefined): string {
  if (!chainName) return "Unknown";
  return chainName.split(" ")[0];
}
