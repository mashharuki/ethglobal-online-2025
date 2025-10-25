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

  /// @notice クロスチェーン変換開始イベント（Avail Nexus SDK 連携用）
  /// @param conversionId 変換ID（オフチェーン連携用）
  /// @param token 変換元トークン
  /// @param amount 変換額
  /// @param targetChain 変換先チェーン名
  /// @param targetRecipient 変換先受取者（チェーン固有フォーマット）
  /// @param sink 転送先シンク（ブリッジエージェント等）
  /// @param metadata 追加ペイロード（Nexus SDK 用）
  event ConversionInitiated(
    bytes32 indexed conversionId,
    address indexed token,
    uint256 amount,
    string targetChain,
    bytes targetRecipient,
    address indexed sink,
    bytes metadata
  );

  /// @notice プールからの出金イベント
  /// @param token トークン
  /// @param amount 金額
  /// @param to 送付先
  event FundsWithdrawn(address indexed token, uint256 amount, address indexed to);

  /// @notice ERC20 の寄付
  /// @param token トークンアドレス
  /// @param amount 寄付金額
  function donate(address token, uint256 amount) external;

  /// @notice ETH の寄付
  function donateETH() external payable;

  /// @notice プール内残高の参照
  /// @param token トークンアドレス（ETH の場合は address(0)）
  function balanceOf(address token) external view returns (uint256);

  /// @notice 指定トークンの残高を取得（エイリアス）
  function getBalance(address token) external view returns (uint256);

  /// @notice 追跡中の全トークン残高を一括取得
  function getAllBalances()
    external
    view
    returns (address[] memory tokens, uint256[] memory balances);

  /// @notice 変換の開始（Avail Nexus SDK が購読するイベントを発火）
  /// @param token 変換元トークン
  /// @param amount 変換額
  /// @param targetChain 変換先チェーン名
  /// @param targetRecipient 変換先受取者（チェーン固有フォーマット）
  /// @param metadata 追加ペイロード
  /// @return conversionId 生成された変換ID
  function initiateConversion(
    address token,
    uint256 amount,
    string calldata targetChain,
    bytes calldata targetRecipient,
    bytes calldata metadata
  ) external payable returns (bytes32 conversionId);

  /// @notice プールから資金を引き出す（変換後の受取など）
  /// @param token トークン（ETH は address(0)）
  /// @param amount 金額
  /// @param to 送付先
  function withdrawFunds(address token, uint256 amount, address payable to) external;

  /// @notice 変換シンク（ブリッジエージェント等）の設定
  /// @param sink 送付先アドレス
  function setConversionSink(address sink) external;
}
