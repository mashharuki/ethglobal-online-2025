// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IDonationPool } from "../interfaces/IDonationPool.sol";

/// @notice Malicious ERC20 that attempts to reenter DonationPool.donate during transferFrom
contract ReentrantToken is ERC20 {
  address public pool;
  bool public reenter;

  constructor() ERC20("ReentrantToken", "RNT") {
    _mint(msg.sender, 1_000_000 ether);
  }

  function setPool(address _pool) external {
    pool = _pool;
  }

  function setReenter(bool _flag) external {
    reenter = _flag;
  }

  // allow receiving ETH for potential donateETH reentry attempts
  receive() external payable {}

  function transferFrom(address from, address to, uint256 value) public override returns (bool) {
    if (reenter && pool != address(0)) {
      // Attempt to reenter DonationPool.donate; should revert with ReentrancyGuard
      IDonationPool(pool).donate(address(this), 1);
    }
    return super.transferFrom(from, to, value);
  }
}

