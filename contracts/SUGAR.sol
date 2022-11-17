// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SugarToken is ERC20 {
    constructor() ERC20("SugarToken", "SGR") {
        _mint(msg.sender, 10000);
    }
}
