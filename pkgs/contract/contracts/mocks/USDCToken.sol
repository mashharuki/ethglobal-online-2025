// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Mock USD Coin (USDC) for demo
contract USDCToken is ERC20 {
  constructor() ERC20("USD Coin", "USDC") {
    _mint(msg.sender, 10_000_000 * 10 ** decimals());
  }

  function decimals() public pure override returns (uint8) {
    return 6; // USDC uses 6 decimals
  }
}

