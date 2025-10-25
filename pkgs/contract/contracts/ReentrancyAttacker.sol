// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ReentrancyAttacker
 * @dev リエントランシー攻撃をテストするためのコントラクト
 */
contract ReentrancyAttacker {
    address public target;
    bool public attacking;

    event AttackAttempt(address indexed target, uint256 amount);
    event ReentrancyAttempt(address indexed target, uint256 amount);

    constructor(address _target) {
        target = _target;
    }

    /**
     * @dev リエントランシー攻撃を開始
     */
    function attack() external payable {
        attacking = true;
        emit AttackAttempt(target, msg.value);

        (bool success, ) = target.call{value: msg.value}("");
        require(success, "Attack failed");
    }

    /**
     * @dev リエントランシー攻撃の再帰呼び出し
     */
    receive() external payable {
        if (attacking && address(this).balance > 0) {
            attacking = false;
            emit ReentrancyAttempt(target, address(this).balance);

            (bool success, ) = target.call{value: address(this).balance}("");
            require(success, "Reentrancy attack failed");
        }
    }

    /**
     * @dev 攻撃状態をリセット
     */
    function reset() external {
        attacking = false;
    }
}
