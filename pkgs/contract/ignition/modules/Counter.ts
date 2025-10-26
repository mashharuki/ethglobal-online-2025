import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Counterコントラクトのデプロイスクリプト
 */
export default buildModule("CounterModule", (m) => {
  // Counterコントラクトをデプロイ
  const counter = m.contract("Counter");
  // incBy関数を呼び出してカウンターを5増加させる
  m.call(counter, "incBy", [5n]);

  return { counter };
});
