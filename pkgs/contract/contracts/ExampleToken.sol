// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Example ERC20 token using OpenZeppelin
contract ExampleToken is ERC20 {
  constructor() ERC20("ExampleToken", "EXT") {
    _mint(msg.sender, 1_000_000 ether);
  }
}

