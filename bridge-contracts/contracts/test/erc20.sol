// The Licensed Work is (c) 2022 Sygma
// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";


/**
  @dev This contract mocks ERC20PresetMinterPauser where and "transferFrom()" always fails
 */
contract ERC20PresetMinterPauserMock is ERC20PresetMinterPauser {

    constructor(
        string memory name,
        string memory symbol
    ) ERC20PresetMinterPauser(name, symbol) {}

    function transferFrom(address from, address to, uint256 amount) public virtual override(ERC20) returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return false;
    }
}

contract ERC20PresetMinterPauserDecimals is ERC20PresetMinterPauser {

    uint8 private immutable customDecimals;
    constructor(string memory name, string memory symbol, uint8 _decimals) ERC20PresetMinterPauser(name, symbol){
        customDecimals = _decimals;
    }

    function decimals() public view virtual override(ERC20) returns (uint8) {
        return customDecimals;
    }
}