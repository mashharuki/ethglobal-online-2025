// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IDonationPool {
  /// @notice ERC20 寄付イベント
  /// @param donor 寄付者
  /// @param token 寄付トークン
  /// @param amount 金額
  event Donated(address indexed donor, address indexed token, uint256 amount);

  /// @notice ETH 寄付イベント
  /// @param donor 寄付者
  /// @param amount 金額（wei）
  event DonatedETH(address indexed donor, uint256 amount);

  /// @notice ERC20 の寄付
  /// @param token トークンアドレス
  /// @param amount 寄付金額
  function donate(address token, uint256 amount) external;

  /// @notice ETH の寄付
  function donateETH() external payable;

  /// @notice プール内残高の参照
  /// @param token トークンアドレス（ETH の場合は address(0)）
  function balanceOf(address token) external view returns (uint256);
}
