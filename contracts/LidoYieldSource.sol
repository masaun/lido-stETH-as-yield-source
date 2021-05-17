// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.12;

import { IYieldSource } from "./pooltogether/IYieldSource.sol";
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { WstETH } from "./lido/WstETH.sol";


/// @title An pooltogether yield source for wstETH/stETH token
contract LidoYieldSource is IYieldSource {
    using SafeMath for uint256;

    WstETH public wstETH;
    address WST_ETH;
    mapping(address => uint256) public balances;

    constructor(WstETH _wstETH) public {
        wstETH = _wstETH;
        WST_ETH = address(wstETH);
    }

    /// @notice Returns the ERC20 asset token used for deposits.
    /// @return The ERC20 asset token
    function depositToken() public view override returns (address) {}

    function balanceOfToken(address addr) public override returns (uint256) {}

    function supplyTokenTo(uint256 amount, address to) public override {}

    function redeemToken(uint256 amount) public override returns (uint256) {}

}
