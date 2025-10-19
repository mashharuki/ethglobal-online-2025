// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./DonationPool.sol";

/**
 * @title CREATE2Factory
 * @dev CREATE2を使用して統一アドレスでDonationPoolをデプロイするFactoryコントラクト
 * @notice マルチチェーンで同一アドレスを実現するコア機能
 */
contract CREATE2Factory {
    // ============ カスタムエラー ============

    /// @dev 無効なアドレスエラー
    error InvalidAddress(string message);

    /// @dev 無効なパラメータエラー
    error InvalidParameter(string message);

    /// @dev プールが既に存在するエラー
    error PoolAlreadyExists(address poolAddress);

    /// @dev プールが存在しないエラー
    error PoolDoesNotExist(address poolAddress);

    /// @dev デプロイに失敗したエラー
    error DeploymentFailed(address expectedAddress);

    /// @dev 無効なソルトエラー
    error InvalidSalt(bytes32 salt);

    // ============ 状態変数 ============

    /// @dev デプロイ済みプールのマッピング
    mapping(address => bool) public deployedPools;

    /// @dev プールの詳細情報
    mapping(address => PoolInfo) public poolInfo;

    /// @dev プールの総数
    uint256 public totalPools;

    /// @dev プールのリスト
    address[] public poolList;

    /// @dev プールの詳細情報構造体
    struct PoolInfo {
        address owner;
        string projectName;
        string projectDescription;
        address targetToken;
        bytes32 salt;
        uint256 deploymentTime;
        bool isActive;
    }

    /// @dev デプロイ用のパラメータ構造体
    struct DeploymentParams {
        string projectName;
        string projectDescription;
        address targetToken;
        address owner;
        bytes32 salt;
    }

    // ============ イベント ============

    /// @dev プールがデプロイされた時に発行
    event PoolDeployed(
        address indexed poolAddress,
        address indexed owner,
        string projectName,
        bytes32 indexed salt,
        uint256 deploymentTime
    );

    /// @dev プールが無効化された時に発行
    event PoolDeactivated(
        address indexed poolAddress,
        address indexed by,
        uint256 timestamp
    );

    /// @dev プールが再アクティブ化された時に発行
    event PoolReactivated(
        address indexed poolAddress,
        address indexed by,
        uint256 timestamp
    );

    /// @dev アドレスが事前計算された時に発行
    event AddressPrecalculated(
        address indexed calculatedAddress,
        bytes32 indexed salt,
        address owner
    );

    // ============ コンストラクタ ============

    constructor() {
        // Factoryコントラクトの初期化
    }

    // ============ CREATE2デプロイ機能 ============

    /**
     * @dev CREATE2を使用してDonationPoolをデプロイ
     * @param params デプロイパラメータ
     * @return poolAddress デプロイされたプールのアドレス
     */
    function deployPool(DeploymentParams calldata params) external returns (address poolAddress) {
        // パラメータの検証
        if (params.owner == address(0)) {
            revert InvalidAddress("Owner cannot be zero address");
        }
        if (params.targetToken == address(0)) {
            revert InvalidAddress("Target token cannot be zero address");
        }
        if (bytes(params.projectName).length == 0) {
            revert InvalidParameter("Project name cannot be empty");
        }
        if (params.salt == bytes32(0)) {
            revert InvalidSalt(params.salt);
        }

        // アドレスを事前計算
        poolAddress = _calculateAddress(params.salt, params.owner);

        // 既にデプロイされているかチェック
        if (deployedPools[poolAddress]) {
            revert PoolAlreadyExists(poolAddress);
        }

        // CREATE2を使用してデプロイ
        bytes memory bytecode = abi.encodePacked(
            type(DonationPool).creationCode,
            abi.encode(
                params.projectName,
                params.projectDescription,
                params.targetToken,
                params.owner
            )
        );

        assembly {
            poolAddress := create2(0, add(bytecode, 0x20), mload(bytecode), params.salt)
        }

        // デプロイが成功したかチェック
        if (poolAddress == address(0)) {
            revert DeploymentFailed(poolAddress);
        }

        // プール情報を記録
        deployedPools[poolAddress] = true;
        poolInfo[poolAddress] = PoolInfo({
            owner: params.owner,
            projectName: params.projectName,
            projectDescription: params.projectDescription,
            targetToken: params.targetToken,
            salt: params.salt,
            deploymentTime: block.timestamp,
            isActive: true
        });

        totalPools++;
        poolList.push(poolAddress);

        emit PoolDeployed(
            poolAddress,
            params.owner,
            params.projectName,
            params.salt,
            block.timestamp
        );

        return poolAddress;
    }

    /**
     * @dev アドレスを事前計算
     * @param salt ソルト値
     * @param owner プールの所有者
     * @return calculatedAddress 計算されたアドレス
     */
    function calculateAddress(bytes32 salt, address owner) external view returns (address calculatedAddress) {
        return _calculateAddress(salt, owner);
    }

    /**
     * @dev 複数のアドレスを事前計算
     * @param salts ソルト値の配列
     * @param owners 所有者の配列
     * @return addresses 計算されたアドレスの配列
     */
    function calculateAddresses(
        bytes32[] calldata salts,
        address[] calldata owners
    ) external view returns (address[] memory addresses) {
        require(salts.length == owners.length, "Arrays length mismatch");

        addresses = new address[](salts.length);
        for (uint256 i = 0; i < salts.length; i++) {
            addresses[i] = _calculateAddress(salts[i], owners[i]);
        }

        return addresses;
    }

    /**
     * @dev 内部的なアドレス計算関数
     * @param salt ソルト値
     * @param owner プールの所有者
     * @return calculatedAddress 計算されたアドレス
     */
    function _calculateAddress(bytes32 salt, address owner) internal view returns (address calculatedAddress) {
        bytes memory bytecode = abi.encodePacked(
            type(DonationPool).creationCode,
            abi.encode(
                "", // プロジェクト名（計算時は空でOK）
                "", // プロジェクト説明（計算時は空でOK）
                address(0), // 目標トークン（計算時はゼロアドレスでOK）
                owner
            )
        );

        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(bytecode)
            )
        );

        return address(uint160(uint256(hash)));
    }

    // ============ プール管理機能 ============

    /**
     * @dev プールを無効化
     * @param poolAddress プールアドレス
     */
    function deactivatePool(address poolAddress) external {
        if (!deployedPools[poolAddress]) {
            revert PoolDoesNotExist(poolAddress);
        }

        PoolInfo storage info = poolInfo[poolAddress];
        if (info.owner != msg.sender) {
            revert InvalidAddress("Only pool owner can deactivate");
        }

        info.isActive = false;
        emit PoolDeactivated(poolAddress, msg.sender, block.timestamp);
    }

    /**
     * @dev プールを再アクティブ化
     * @param poolAddress プールアドレス
     */
    function reactivatePool(address poolAddress) external {
        if (!deployedPools[poolAddress]) {
            revert PoolDoesNotExist(poolAddress);
        }

        PoolInfo storage info = poolInfo[poolAddress];
        if (info.owner != msg.sender) {
            revert InvalidAddress("Only pool owner can reactivate");
        }

        info.isActive = true;
        emit PoolReactivated(poolAddress, msg.sender, block.timestamp);
    }

    /**
     * @dev プールの詳細情報を取得
     * @param poolAddress プールアドレス
     * @return info プールの詳細情報
     */
    function getPoolInfo(address poolAddress) external view returns (PoolInfo memory info) {
        if (!deployedPools[poolAddress]) {
            revert PoolDoesNotExist(poolAddress);
        }

        return poolInfo[poolAddress];
    }

    /**
     * @dev アクティブなプールのリストを取得
     * @return activePools アクティブなプールのアドレス配列
     */
    function getActivePools() external view returns (address[] memory activePools) {
        uint256 activeCount = 0;

        // アクティブなプールの数をカウント
        for (uint256 i = 0; i < poolList.length; i++) {
            if (poolInfo[poolList[i]].isActive) {
                activeCount++;
            }
        }

        // アクティブなプールの配列を作成
        activePools = new address[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < poolList.length; i++) {
            if (poolInfo[poolList[i]].isActive) {
                activePools[index] = poolList[i];
                index++;
            }
        }

        return activePools;
    }

    /**
     * @dev 所有者のプールリストを取得
     * @param owner 所有者アドレス
     * @return ownerPools 所有者のプールアドレス配列
     */
    function getPoolsByOwner(address owner) external view returns (address[] memory ownerPools) {
        if (owner == address(0)) {
            revert InvalidAddress("Owner cannot be zero address");
        }

        uint256 ownerPoolCount = 0;

        // 所有者のプール数をカウント
        for (uint256 i = 0; i < poolList.length; i++) {
            if (poolInfo[poolList[i]].owner == owner) {
                ownerPoolCount++;
            }
        }

        // 所有者のプール配列を作成
        ownerPools = new address[](ownerPoolCount);
        uint256 index = 0;

        for (uint256 i = 0; i < poolList.length; i++) {
            if (poolInfo[poolList[i]].owner == owner) {
                ownerPools[index] = poolList[i];
                index++;
            }
        }

        return ownerPools;
    }

    /**
     * @dev 全プールのリストを取得
     * @return allPools 全プールのアドレス配列
     */
    function getAllPools() external view returns (address[] memory allPools) {
        return poolList;
    }

    /**
     * @dev プールの総数を取得
     * @return count プールの総数
     */
    function getPoolCount() external view returns (uint256 count) {
        return totalPools;
    }

    /**
     * @dev プールが存在するかチェック
     * @param poolAddress プールアドレス
     * @return exists 存在するかどうか
     */
    function poolExists(address poolAddress) external view returns (bool exists) {
        return deployedPools[poolAddress];
    }

    /**
     * @dev プールがアクティブかチェック
     * @param poolAddress プールアドレス
     * @return isActive アクティブかどうか
     */
    function isPoolActive(address poolAddress) external view returns (bool isActive) {
        if (!deployedPools[poolAddress]) {
            return false;
        }

        return poolInfo[poolAddress].isActive;
    }

    // ============ ユーティリティ関数 ============

    /**
     * @dev ソルト値を生成
     * @param projectName プロジェクト名
     * @param owner 所有者アドレス
     * @param nonce ノンス値
     * @return salt 生成されたソルト値
     */
    function generateSalt(
        string memory projectName,
        address owner,
        uint256 nonce
    ) external pure returns (bytes32 salt) {
        return keccak256(abi.encodePacked(projectName, owner, nonce));
    }

    /**
     * @dev 複数のソルト値を生成
     * @param projectNames プロジェクト名の配列
     * @param owners 所有者アドレスの配列
     * @param nonces ノンス値の配列
     * @return salts 生成されたソルト値の配列
     */
    function generateSalts(
        string[] memory projectNames,
        address[] memory owners,
        uint256[] memory nonces
    ) external pure returns (bytes32[] memory salts) {
        require(
            projectNames.length == owners.length && owners.length == nonces.length,
            "Arrays length mismatch"
        );

        salts = new bytes32[](projectNames.length);
        for (uint256 i = 0; i < projectNames.length; i++) {
            salts[i] = keccak256(abi.encodePacked(projectNames[i], owners[i], nonces[i]));
        }

        return salts;
    }
}
