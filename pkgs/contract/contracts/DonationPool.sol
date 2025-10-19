// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title DonationPool
 * @dev CrossDonateプロジェクトのコアとなる寄付プールコントラクト
 * @notice 複数のトークンとチェーンからの寄付を受け取り、統一された管理を提供
 */
contract DonationPool is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    using Address for address payable;

    // ============ 状態変数 ============

    /// @dev 目標トークン（集約先のトークン）
    address public targetToken;

    /// @dev サポートされているトークンのリスト
    mapping(address => bool) public supportedTokens;

    /// @dev 各トークンの総寄付額
    mapping(address => uint256) public totalDonations;

    /// @dev 寄付者の総寄付額
    mapping(address => uint256) public donorContributions;

    /// @dev プロジェクトの基本情報
    string public projectName;
    string public projectDescription;

    /// @dev 寄付の最小・最大制限
    uint256 public minDonationAmount;
    uint256 public maxDonationAmount;

    /// @dev 寄付の有効性フラグ
    bool public donationsEnabled;

    // ============ イベント ============

    /// @dev ETH寄付が受け取られた時に発行
    event ETHDonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );

    /// @dev ERC20トークン寄付が受け取られた時に発行
    event TokenDonationReceived(
        address indexed donor,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    /// @dev サポートトークンが追加された時に発行
    event TokenSupported(
        address indexed token,
        bool supported
    );

    /// @dev 寄付設定が変更された時に発行
    event DonationSettingsUpdated(
        uint256 minAmount,
        uint256 maxAmount,
        bool enabled
    );

    /// @dev 目標トークンが変更された時に発行
    event TargetTokenUpdated(
        address indexed oldToken,
        address indexed newToken
    );

    // ============ コンストラクタ ============

    /**
     * @dev コントラクトの初期化
     * @param _projectName プロジェクト名
     * @param _projectDescription プロジェクト説明
     * @param _targetToken 目標トークンアドレス
     * @param _owner コントラクトの所有者
     */
    constructor(
        string memory _projectName,
        string memory _projectDescription,
        address _targetToken,
        address _owner
    ) Ownable(_owner) {
        require(_targetToken != address(0), "DonationPool: Invalid target token");
        require(_owner != address(0), "DonationPool: Invalid owner");

        projectName = _projectName;
        projectDescription = _projectDescription;
        targetToken = _targetToken;

        // 初期設定
        minDonationAmount = 0;
        maxDonationAmount = type(uint256).max;
        donationsEnabled = true;

        // ETHをサポートトークンとして追加
        supportedTokens[address(0)] = true;

        emit TargetTokenUpdated(address(0), _targetToken);
        emit DonationSettingsUpdated(minDonationAmount, maxDonationAmount, donationsEnabled);
    }

    // ============ 寄付機能 ============

    /**
     * @dev ETH寄付を受け取る
     * @notice msg.valueで送金されたETHを受け取る
     */
    function donateETH() external payable nonReentrant {
        require(donationsEnabled, "DonationPool: Donations are disabled");
        require(msg.value > 0, "DonationPool: Donation amount must be greater than 0");
        require(msg.value >= minDonationAmount, "DonationPool: Donation below minimum");
        require(msg.value <= maxDonationAmount, "DonationPool: Donation exceeds maximum");

        // 寄付額を記録
        totalDonations[address(0)] += msg.value;
        donorContributions[msg.sender] += msg.value;

        emit ETHDonationReceived(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev ERC20トークン寄付を受け取る
     * @param token 寄付するトークンのアドレス
     * @param amount 寄付するトークン量
     */
    function donate(address token, uint256 amount) external nonReentrant {
        require(donationsEnabled, "DonationPool: Donations are disabled");
        require(token != address(0), "DonationPool: Invalid token address");
        require(supportedTokens[token], "DonationPool: Token not supported");
        require(amount > 0, "DonationPool: Donation amount must be greater than 0");
        require(amount >= minDonationAmount, "DonationPool: Donation below minimum");
        require(amount <= maxDonationAmount, "DonationPool: Donation exceeds maximum");

        // トークンを転送
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // 寄付額を記録
        totalDonations[token] += amount;
        donorContributions[msg.sender] += amount;

        emit TokenDonationReceived(msg.sender, token, amount, block.timestamp);
    }

    // ============ 管理者機能 ============

    /**
     * @dev サポートトークンを追加/削除
     * @param token トークンアドレス
     * @param supported サポートするかどうか
     */
    function setSupportedToken(address token, bool supported) external onlyOwner {
        require(token != address(0), "DonationPool: Invalid token address");

        supportedTokens[token] = supported;
        emit TokenSupported(token, supported);
    }

    /**
     * @dev 寄付設定を更新
     * @param _minAmount 最小寄付額
     * @param _maxAmount 最大寄付額
     * @param _enabled 寄付の有効性
     */
    function updateDonationSettings(
        uint256 _minAmount,
        uint256 _maxAmount,
        bool _enabled
    ) external onlyOwner {
        require(_minAmount <= _maxAmount, "DonationPool: Invalid amount range");

        minDonationAmount = _minAmount;
        maxDonationAmount = _maxAmount;
        donationsEnabled = _enabled;

        emit DonationSettingsUpdated(_minAmount, _maxAmount, _enabled);
    }

    /**
     * @dev 目標トークンを変更
     * @param _targetToken 新しい目標トークンアドレス
     */
    function setTargetToken(address _targetToken) external onlyOwner {
        require(_targetToken != address(0), "DonationPool: Invalid target token");

        address oldToken = targetToken;
        targetToken = _targetToken;

        emit TargetTokenUpdated(oldToken, _targetToken);
    }

    /**
     * @dev プロジェクト情報を更新
     * @param _name 新しいプロジェクト名
     * @param _description 新しいプロジェクト説明
     */
    function updateProjectInfo(
        string memory _name,
        string memory _description
    ) external onlyOwner {
        projectName = _name;
        projectDescription = _description;
    }

    // ============ 残高管理機能 ============

    /**
     * @dev 特定トークンの残高を取得
     * @param token トークンアドレス（address(0)はETH）
     * @return balance 残高
     */
    function getBalance(address token) external view returns (uint256 balance) {
        if (token == address(0)) {
            return address(this).balance;
        }

        try IERC20(token).balanceOf(address(this)) returns (uint256 tokenBalance) {
            return tokenBalance;
        } catch {
            return 0;
        }
    }

    /**
     * @dev 全サポートトークンの残高を一括取得
     * @return tokens トークンアドレス配列
     * @return balances 対応する残高配列
     */
    function getAllBalances() external view returns (address[] memory tokens, uint256[] memory balances) {
        // サポートされているトークンのリストを作成
        address[] memory supportedTokensList = new address[](1);
        supportedTokensList[0] = address(0); // ETH

        // 各トークンの残高を取得
        uint256[] memory balanceList = new uint256[](1);
        balanceList[0] = address(this).balance;

        return (supportedTokensList, balanceList);
    }

    /**
     * @dev 指定されたトークンリストの残高を取得
     * @param tokenList 取得したいトークンアドレスの配列
     * @return balances 対応する残高配列
     */
    function getBalances(address[] calldata tokenList) external view returns (uint256[] memory balances) {
        uint256 length = tokenList.length;
        balances = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            if (tokenList[i] == address(0)) {
                balances[i] = address(this).balance;
            } else {
                try IERC20(tokenList[i]).balanceOf(address(this)) returns (uint256 balance) {
                    balances[i] = balance;
                } catch {
                    balances[i] = 0;
                }
            }
        }
    }

    /**
     * @dev サポートされているトークンの詳細情報を取得
     * @return tokenAddresses トークンアドレス配列
     * @return tokenBalances 残高配列
     * @return tokenNames トークン名配列（可能な場合）
     * @return tokenSymbols トークンシンボル配列（可能な場合）
     */
    function getDetailedBalances() external view returns (
        address[] memory tokenAddresses,
        uint256[] memory tokenBalances,
        string[] memory tokenNames,
        string[] memory tokenSymbols
    ) {
        // ETHを含むサポートトークンのリスト
        address[] memory tokens = new address[](1);
        tokens[0] = address(0);

        uint256[] memory balances = new uint256[](1);
        balances[0] = address(this).balance;

        string[] memory names = new string[](1);
        names[0] = "Ethereum";

        string[] memory symbols = new string[](1);
        symbols[0] = "ETH";

        return (tokens, balances, names, symbols);
    }

    /**
     * @dev 残高の合計値を取得（ETHベース）
     * @return totalBalance 全残高の合計（wei単位）
     */
    function getTotalBalance() external view returns (uint256 totalBalance) {
        return address(this).balance;
    }

    /**
     * @dev 特定トークンの寄付統計を取得
     * @param token トークンアドレス
     * @return totalDonated 総寄付額
     * @return currentBalance 現在の残高
     * @return isSupported サポートされているかどうか
     */
    function getTokenStats(address token) external view returns (
        uint256 totalDonated,
        uint256 currentBalance,
        bool isSupported
    ) {
        totalDonated = totalDonations[token];
        isSupported = supportedTokens[token];

        if (token == address(0)) {
            currentBalance = address(this).balance;
        } else {
            try IERC20(token).balanceOf(address(this)) returns (uint256 balance) {
                currentBalance = balance;
            } catch {
                currentBalance = 0;
            }
        }
    }

    // ============ 従来のビュー関数 ============

    /**
     * @dev コントラクトのETH残高を取得
     * @return ETH残高
     */
    function getETHBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev 指定トークンの残高を取得
     * @param token トークンアドレス
     * @return トークン残高
     */
    function getTokenBalance(address token) external view returns (uint256) {
        if (token == address(0)) {
            return address(this).balance;
        }
        return IERC20(token).balanceOf(address(this));
    }

    /**
     * @dev 寄付者の総寄付額を取得
     * @param donor 寄付者アドレス
     * @return 総寄付額
     */
    function getDonorTotalContribution(address donor) external view returns (uint256) {
        return donorContributions[donor];
    }

    /**
     * @dev プロジェクトの基本情報を取得
     * @return name プロジェクト名
     * @return description プロジェクト説明
     * @return target 目標トークンアドレス
     * @return enabled 寄付の有効性
     */
    function getProjectInfo() external view returns (
        string memory name,
        string memory description,
        address target,
        bool enabled
    ) {
        return (projectName, projectDescription, targetToken, donationsEnabled);
    }

    // ============ 緊急機能 ============

    /**
     * @dev 緊急時のETH引き出し（所有者のみ）
     * @param to 引き出し先アドレス
     * @param amount 引き出し量
     */
    function emergencyWithdrawETH(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "DonationPool: Invalid recipient");
        require(amount <= address(this).balance, "DonationPool: Insufficient balance");

        to.sendValue(amount);
    }

    /**
     * @dev 緊急時のERC20トークン引き出し（所有者のみ）
     * @param token トークンアドレス
     * @param to 引き出し先アドレス
     * @param amount 引き出し量
     */
    function emergencyWithdrawToken(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        require(token != address(0), "DonationPool: Invalid token");
        require(to != address(0), "DonationPool: Invalid recipient");
        require(amount <= IERC20(token).balanceOf(address(this)), "DonationPool: Insufficient balance");

        IERC20(token).safeTransfer(to, amount);
    }

    // ============ フォールバック関数 ============

    /**
     * @dev ETHの直接送金を受け取る
     */
    receive() external payable {
        if (donationsEnabled && msg.value > 0) {
            totalDonations[address(0)] += msg.value;
            donorContributions[msg.sender] += msg.value;
            emit ETHDonationReceived(msg.sender, msg.value, block.timestamp);
        }
    }
}
