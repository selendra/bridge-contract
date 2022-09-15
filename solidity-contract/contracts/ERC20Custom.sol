// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets//ERC20PresetMinterPauser.sol";


contract ERC20Custom is ERC20PresetMinterPauser {

    /**
     * @dev Allows overriding the name, symbol & decimal of the base ERC20 contract
     */
    constructor(string memory name, string memory symbol) public ERC20PresetMinterPauser(name, symbol) {
    }

    function decimals() public view override returns (uint8) {
		return 12;
	}
}
