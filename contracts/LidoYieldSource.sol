// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.12;

import { IYieldSource } from "./pooltogether/IYieldSource.sol";
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { StETHMockERC20 } from "./lido/mocks/StETHMockERC20.sol";
import { WstETH } from "./lido/WstETH.sol";


/// @title An pooltogether yield source for wstETH/stETH token
contract LidoYieldSource is IYieldSource {
    using SafeMath for uint256;

    StETHMockERC20 public stETH;
    WstETH public wstETH;
    address ST_ETH;
    address WST_ETH;
    mapping(address => uint256) public balances;  /// Underlying asset balance

    constructor(StETHMockERC20 _stETH, WstETH _wstETH) public {
        stETH = _stETH;
        wstETH = _wstETH;
        ST_ETH = address(stETH);
        WST_ETH = address(wstETH);
    }

    /// @notice Returns the ERC20 asset token used for deposits.
    /// @return The ERC20 asset token
    function depositToken() public view override returns (address) {
        return WST_ETH;        
    }

    /// @notice Returns the total balance (in asset tokens).  This includes the deposits and interest.
    /// @return The underlying balance of asset tokens
    function balanceOfToken(address addr) public override returns (uint256) {
        if (balances[addr] == 0) return 0;

        uint256 stETHBalance = stETH.balanceOf(addr);
        return stETHBalance;
    }

    /// @notice Allows assets to be supplied on other user's behalf using the `to` param.
    /// @param amount The amount of `token()` to be supplied
    /// @param to The user whose balance will receive the tokens
    function supplyTokenTo(uint256 amount, address to) public override {
        stETH.transferFrom(msg.sender, address(this), amount);
        stETH.approve(WST_ETH, amount);

        uint256 beforeBalance = wstETH.balanceOf(address(this));
        wstETH.wrap(amount);
        uint256 afterBalance = wstETH.balanceOf(address(this));
        uint256 balanceDiff = afterBalance.sub(beforeBalance);
        balances[to] = balances[to].add(balanceDiff);
    }

    /// @notice Redeems tokens from the yield source from the msg.sender, it burn yield bearing tokens and return token to the sender.
    /// @param amount The amount of `token()` to withdraw.  Denominated in `token()` as above.
    /// @return The actual amount of tokens that were redeemed.
    function redeemToken(uint256 amount) public override returns (uint256) {}

}
