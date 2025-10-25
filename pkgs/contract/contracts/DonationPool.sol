// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {IDonationPool} from "./interfaces/IDonationPool.sol";

/// @title DonationPool (v1, merged)
/// @notice ETH / ERC20 の寄付受領・残高管理に加え、将来のコンバージョン連携を想定
/// - `IDonationPool` に準拠
/// - OZ v5 系の ReentrancyGuard / Ownable を使用
/// - README 記載の「緊急引き出し」関数をラッパとして追加（withdrawFunds を内部利用）
contract DonationPool is IDonationPool, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice 変換先トークン（将来のコンバージョン機能向け）
    address public targetToken;

    /// @notice サポートするトークンの許可リスト（ETH は address(0)）
    mapping(address => bool) public supportedTokens;

    /// @dev token => total balance in pool
    mapping(address => uint256) private _balances;

    /// @dev 追跡中のトークン（getAllBalances 用）
    address[] private _trackedTokens;
    mapping(address => bool) private _isTracked;

    /// @dev 変換関連
    address public conversionSink; // Avail Nexus SDK を実行するエージェント/ブリッジ先
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

    /// @param initialOwner オーナー
    /// @param targetToken_ 変換先トークンアドレス
    /// @param initialSupported 初期サポートトークン配列（ETH を許可する場合は address(0) を含める）
    constructor(
        address initialOwner,
        address targetToken_,
        address[] memory initialSupported
    ) Ownable(initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        targetToken = targetToken_;
        // 初期サポートトークン設定
        for (uint256 i = 0; i < initialSupported.length; i++) {
            address token = initialSupported[i];
            supportedTokens[token] = true;
            _trackToken(token);
        }
    }

    // -------- Owner ops --------

    /// @notice サポートトークンの設定
    function setSupportedToken(address token, bool supported) external onlyOwner {
        if (token == address(0)) revert ZeroAddress();
        supportedTokens[token] = supported;
        if (supported) _trackToken(token);
    }

    /// @notice targetToken の更新
    function setTargetToken(address newTarget) external onlyOwner {
        if (newTarget == address(0)) revert ZeroAddress();
        targetToken = newTarget;
    }

    /// @notice 変換の出力先シンクを設定
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

    // -------- Conversion (owner) --------

    /// @inheritdoc IDonationPool
    function initiateConversion(
        address token,
        uint256 amount,
        string calldata targetChain,
        bytes calldata targetRecipient,
        bytes calldata metadata
    )
        external
        payable
        override
        onlyOwner
        nonReentrant
        returns (bytes32 conversionId)
    {
        if (amount == 0) revert ZeroAmount();
        if (!supportedTokens[token]) revert UnsupportedToken();
        if (_balances[token] < amount) revert InsufficientBalance();
        if (conversionSink == address(0)) revert SinkNotSet();

        // 減算してから外部転送（Checks-Effects-Interactions + nonReentrant）
        _balances[token] -= amount;

        if (token == address(0)) {
            // 付随ETHは禁止（コントラクト保有ETHのみを使用）
            if (msg.value != 0) revert InvalidMsgValue();
            if (address(this).balance < amount) revert InsufficientEthBalance();
            (bool ok, ) = payable(conversionSink).call{value: amount}("");
            if (!ok) revert ETHSendFailed();
        } else {
            if (msg.value != 0) revert InvalidMsgValue();
            IERC20(token).safeTransfer(conversionSink, amount);
        }

        unchecked {
            _conversionNonce++;
        }
        conversionId = keccak256(
            abi.encode(
                block.chainid,
                address(this),
                token,
                amount,
                targetChain,
                targetRecipient,
                _conversionNonce
            )
        );

        emit ConversionInitiated(
            conversionId,
            token,
            amount,
            targetChain,
            targetRecipient,
            conversionSink,
            metadata
        );
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

    /// @notice README互換の緊急引き出し（ETH）
    function emergencyWithdrawETH(address payable to, uint256 amount) external onlyOwner {
        withdrawFunds(address(0), amount, to);
    }

    /// @notice README互換の緊急引き出し（ERC20）
    function emergencyWithdrawToken(address token, address to, uint256 amount) external onlyOwner {
        if (token == address(0)) revert ZeroAddress();
        withdrawFunds(token, amount, payable(to));
    }

    // -------- Receive --------

    /// @dev 受動的に ETH を受領した場合も寄付扱いにする
    receive() external payable {
        if (msg.value > 0 && supportedTokens[address(0)]) {
            _balances[address(0)] += msg.value;
            _trackToken(address(0));
            emit DonatedETH(msg.sender, msg.value);
        }
    }

    // -------- Internal --------

    /// @dev トークンを追跡対象に追加（重複排除）
    function _trackToken(address token) internal {
        if (!_isTracked[token]) {
            _isTracked[token] = true;
            _trackedTokens.push(token);
        }
    }
}
