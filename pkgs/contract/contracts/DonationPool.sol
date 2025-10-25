// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import { IDonationPool } from "./interfaces/IDonationPool.sol";

/// @title DonationPool (v1)
/// @notice ETH / ERC20 寄付の受け取りと残高管理、基本状態の保持
contract DonationPool is IDonationPool, Ownable, ReentrancyGuard {
  using SafeERC20 for IERC20;

  /// @notice 変換先トークン（将来のコンバージョン機能向け）
  address public targetToken;

  /// @notice サポートするトークンの許可リスト（ETH は address(0)）
  mapping(address => bool) public supportedTokens;

  /// @dev token => total balance in pool
  mapping(address => uint256) private _balances;

  /// @dev 追跡中のトークン一覧（getAllBalances 用）
  address[] private _trackedTokens;
  mapping(address => bool) private _isTracked;

  /// @dev errors
  error ZeroAddress();
  error ZeroAmount();
  error UnsupportedToken();

  /// @param initialOwner オーナー
  /// @param targetToken_ 変換先トークンアドレス
  /// @param initialSupported 初期サポートトークン配列（ETH を許可する場合は address(0) を含める）
  constructor(address initialOwner, address targetToken_, address[] memory initialSupported) Ownable(initialOwner) {
    targetToken = targetToken_;
    // 初期サポートトークン設定
    for (uint256 i = 0; i < initialSupported.length; i++) {
      address token = initialSupported[i];
      supportedTokens[token] = true;
      _trackToken(token);
    }
  }

  /// @notice サポートトークンの設定
  function setSupportedToken(address token, bool supported) external onlyOwner {
    supportedTokens[token] = supported;
    if (supported) {
      _trackToken(token);
    }
  }

  /// @notice targetToken の更新
  function setTargetToken(address newTarget) external onlyOwner {
    targetToken = newTarget;
  }

  /// @inheritdoc IDonationPool
  function donate(address token, uint256 amount) external nonReentrant {
    if (token == address(0)) revert ZeroAddress();
    if (amount == 0) revert ZeroAmount();
    if (!supportedTokens[token]) revert UnsupportedToken();

    IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    _balances[token] += amount;
    _trackToken(token);
    emit Donated(msg.sender, token, amount);
  }

  /// @inheritdoc IDonationPool
  function donateETH() external payable nonReentrant {
    if (msg.value == 0) revert ZeroAmount();
    if (!supportedTokens[address(0)]) revert UnsupportedToken();

    _balances[address(0)] += msg.value;
    _trackToken(address(0));
    emit DonatedETH(msg.sender, msg.value);
  }

  /// @inheritdoc IDonationPool
  function balanceOf(address token) external view returns (uint256) {
    return _balances[token];
  }

  /// @notice 指定トークンの残高取得（エイリアス）
  function getBalance(address token) external view returns (uint256) {
    return _balances[token];
  }

  /// @notice 追跡中トークンの全残高取得
  function getAllBalances()
    external
    view
    returns (address[] memory tokens, uint256[] memory balances)
  {
    uint256 len = _trackedTokens.length;
    tokens = new address[](len);
    balances = new uint256[](len);
    for (uint256 i = 0; i < len; i++) {
      address t = _trackedTokens[i];
      tokens[i] = t;
      balances[i] = _balances[t];
    }
  }

  /// @dev 受動的に ETH を受領した場合も寄付扱いにする
  receive() external payable {
    if (msg.value > 0 && supportedTokens[address(0)]) {
      _balances[address(0)] += msg.value;
      _trackToken(address(0));
      emit DonatedETH(msg.sender, msg.value);
    }
  }

  /// @dev トークンを追跡対象に追加（重複排除）
  function _trackToken(address token) internal {
    if (!_isTracked[token]) {
      _isTracked[token] = true;
      _trackedTokens.push(token);
    }
  }
}
