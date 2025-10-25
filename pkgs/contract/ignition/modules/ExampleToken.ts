import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * ExampleTokenデプロイスクリプト
 * テストネット用のERC20トークン
 */
export default buildModule("ExampleTokenModule", (m) => {
  // ExampleTokenをデプロイ
  const exampleToken = m.contract("ExampleToken");

  return {
    exampleToken,
  };
});
