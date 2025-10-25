// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Mock PayPal USD (PYUSD) for demo and tests
contract PYUSDToken is ERC20 {
  constructor() ERC20("PayPal USD", "PYUSD") {
    _mint(msg.sender, 10_000_000 * 10 ** decimals());
  }

  function decimals() public pure override returns (uint8) {
    return 6; // PYUSD uses 6 decimals
  }
}

