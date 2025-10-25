import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * DonationPoolコントラクトのデプロイスクリプト
 * ETHGlobal 2025用 - Avail Nexus SDK + PYUSD統合
 * mainnet/testnet共通対応
 */
export default buildModule("DonationPoolModule", (m) => {
  // パラメータ設定
  const initialOwner = m.getParameter("initialOwner", m.getAccount(0)); // デフォルトはデプロイヤー

  // ターゲットトークンアドレス - コマンド引数から取得（必須）
  // 使用例:
  // mainnet PYUSD: --parameters '{"DonationPoolModule":{"targetToken":"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8"}}'
  // testnet用: --parameters '{"DonationPoolModule":{"targetToken":"<ExampleTokenアドレス>"}}'
  // Arbitrum Sepolia PYUSD: --parameters '{"DonationPoolModule":{"targetToken":"0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1"}}'
  const targetToken = m.getParameter("targetToken");

  // 初期サポートトークン配列もパラメータ化
  // デフォルトはETHのみ。追加トークンはコマンド引数で指定
  const initialSupportedTokens = m.getParameter("initialSupportedTokens", [
    "0x0000000000000000000000000000000000000000", // ETH (常に含める)
  ]);

  // DonationPoolコントラクトのデプロイ
  const donationPool = m.contract("DonationPool", [
    initialOwner,
    targetToken,
    initialSupportedTokens,
  ]);

  return {
    donationPool,
  };
});
