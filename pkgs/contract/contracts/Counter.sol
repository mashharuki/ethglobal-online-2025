// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title Counter コントラクト
 */
contract Counter {
  uint public x;

  event Increment(uint by);

  /**
   * 1増やす
   */
  function inc() public {
    x++;
    emit Increment(1);
  }

  /**
   * 任意の数だけ増やすメソッド
   * @param by 任意の数
   */
  function incBy(uint by) public {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }
}

