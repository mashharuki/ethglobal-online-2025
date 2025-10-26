// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {IDonationPool} from "./interfaces/IDonationPool.sol";

/// @title DonationPool (v1, merged)
/// @notice ETH / ERC20 donation receiving and balance management, designed for future conversion integration
/// - Compliant with `IDonationPool` interface
/// - Uses OZ v5 ReentrancyGuard / Ownable
/// - Adds emergency withdrawal function as wrapper (using internal withdrawFunds) as documented in README
contract DonationPool is IDonationPool, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice Target token for conversion (for future conversion features)
    address public targetToken;

    /// @notice Allowlist of supported tokens (ETH is address(0))
    mapping(address => bool) public supportedTokens;

    /// @dev token => total balance in pool
    mapping(address => uint256) private _balances;

    /// @dev Tracked tokens (for getAllBalances)
    address[] private _trackedTokens;
    mapping(address => bool) private _isTracked;

    /// @dev Conversion related
    address public conversionSink; // Agent/bridge destination that executes Avail Nexus SDK
    uint256 private _conversionNonce;

    // -------- Errors --------
    error ZeroAddress();
    error ZeroAmount();
    error UnsupportedToken();
    error InsufficientBalance();
    error ZeroRecipient();
    error SinkNotSet();
    error ETHSendFailed();
    error InvalidMsgValue();
    error InsufficientEthBalance();
    error NotSupported();

    /// @param initialOwner Owner
    /// @param targetToken_ Target token address for conversion
    /// @param initialSupported Initial supported token array (include address(0) to allow ETH)
    constructor(
        address initialOwner,
        address targetToken_,
        address[] memory initialSupported
    ) Ownable(initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        targetToken = targetToken_;
        // Set initial supported tokens
        for (uint256 i = 0; i < initialSupported.length; i++) {
            address token = initialSupported[i];
            supportedTokens[token] = true;
            _trackToken(token);
        }
    }

    /// @notice Update targetToken
    function setTargetToken(address newTarget) external onlyOwner {
        if (newTarget == address(0)) revert ZeroAddress();
        targetToken = newTarget;
    }

    /// @notice Set conversion output sink
    function setConversionSink(address sink) external override onlyOwner {
        if (sink == address(0)) revert ZeroAddress();
        conversionSink = sink;
    }

    // -------- Donate --------

    /// @inheritdoc IDonationPool
    function donate(address token, uint256 amount) external override nonReentrant {
        if (token == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (!supportedTokens[token]) revert UnsupportedToken();

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        _balances[token] += amount;
        _trackToken(token);
        emit Donated(msg.sender, token, amount);
    }

    /// @inheritdoc IDonationPool
    function donateETH() external payable override nonReentrant {
        if (msg.value == 0) revert ZeroAmount();
        if (!supportedTokens[address(0)]) revert UnsupportedToken();

        _balances[address(0)] += msg.value;
        _trackToken(address(0));
        emit DonatedETH(msg.sender, msg.value);
    }

    // -------- Views --------

    /// @inheritdoc IDonationPool
    function balanceOf(address token) external view override returns (uint256) {
        return _balances[token];
    }

    /// @inheritdoc IDonationPool
    function getBalance(address token) external view override returns (uint256) {
        return _balances[token];
    }

    /// @inheritdoc IDonationPool
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

  /// @inheritdoc IDonationPool
  function initiateConversion(
    address token,
    uint256 amount,
    string calldata targetChain,
    bytes calldata targetRecipient,
    bytes calldata metadata
  ) external payable override returns (bytes32 conversionId) {
    // For now, this is a simple implementation that generates a conversion ID
    // In a real implementation, this would integrate with cross-chain protocols
    conversionId = keccak256(abi.encodePacked(
      msg.sender,
      token,
      amount,
      targetChain,
      targetRecipient,
      metadata,
      block.timestamp,
      block.number
    ));

    // Note: This is a placeholder implementation
    // Real implementation would need to integrate with cross-chain infrastructure
    return conversionId;
  }

  /// @inheritdoc IDonationPool
  function swapUsdcToPyusd(address usdc, address pyusd, uint256 amount, address to)
    external
    override
    onlyOwner
    nonReentrant
  {
    if (to == address(0)) revert ZeroRecipient();
    if (amount == 0) revert ZeroAmount();
    if (!supportedTokens[usdc] || !supportedTokens[pyusd]) revert NotSupported();

    // Check internal balance in pool (1:1 swap)
    if (_balances[usdc] < amount) revert InsufficientBalance();
    // if (_balances[pyusd] < amount) revert InsufficientBalance();

    // CEI: Update internal balance first, then transfer
    _balances[usdc] -= amount; // Consume received USDC
    // _balances[pyusd] -= amount; // Consume pool's PYUSD liquidity

    IERC20(pyusd).safeTransfer(to, amount);

    emit Swapped(usdc, pyusd, to, amount);
  }

  /// @dev Treat passive ETH receipt as donations too
  receive() external payable {
    if (msg.value > 0 && supportedTokens[address(0)]) {
      _balances[address(0)] += msg.value;
      _trackToken(address(0));
      emit DonatedETH(msg.sender, msg.value);
    }
  }

    // -------- Withdraw (owner) --------

    /// @inheritdoc IDonationPool
    function withdrawFunds(
        address token,
        uint256 amount,
        address payable to
    ) public override onlyOwner nonReentrant {
        if (to == address(0)) revert ZeroRecipient();
        if (amount == 0) revert ZeroAmount();
        if (_balances[token] < amount) revert InsufficientBalance();

        _balances[token] -= amount;

        if (token == address(0)) {
            (bool ok, ) = to.call{value: amount}("");
            if (!ok) revert ETHSendFailed();
        } else {
            IERC20(token).safeTransfer(to, amount);
        }

        emit FundsWithdrawn(token, amount, to);
    }

    /// @notice README-compatible emergency withdrawal (ETH)
    function emergencyWithdrawETH(address payable to, uint256 amount) external onlyOwner {
        withdrawFunds(address(0), amount, to);
    }

    /// @notice README-compatible emergency withdrawal (ERC20)
    function emergencyWithdrawToken(address token, address to, uint256 amount) external onlyOwner {
        if (token == address(0)) revert ZeroAddress();
        withdrawFunds(token, amount, payable(to));
    }

    // -------- Receive --------
    // Note: receive() function is already defined above around line 155

    // -------- Internal --------

    /// @dev Add token to tracking list (with deduplication)
    function _trackToken(address token) internal {
        if (!_isTracked[token]) {
            _isTracked[token] = true;
            _trackedTokens.push(token);
        }
    }

  /**
   * @Todo: Feature to convert bridged USDC to PYUSD
   * Bridging is planned to use Nexus SDK
   * Nexus SDK side will call Bridge AND Exchange methods to perform bridging and swap simultaneously
   */
}
