// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.12;

import { IYieldSource } from "./pooltogether/IYieldSource.sol";
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { StETHMockERC20 } from "./lido/mocks/StETHMockERC20.sol";


/// @title An pooltogether yield source for wstETH/stETH token
contract LidoYieldSource is IYieldSource {
    using SafeMath for uint256;

    StETHMockERC20 public stETH;
    address ST_ETH;
    mapping(address => uint256) public balances;  /// Underlying asset balance

    constructor(StETHMockERC20 _stETH) public {
        stETH = _stETH;
        ST_ETH = address(stETH);
    }

    /// @notice Returns the ERC20 asset token used for deposits.
    /// @return The ERC20 asset token
    function depositToken() public view override returns (address) {
        address ETH = address(0);
        return ETH;
    }

    /// @notice Returns the total balance (in asset tokens).  This includes the deposits and interest.
    /// @return The underlying balance of asset tokens
    function balanceOfToken(address addr) public view override returns (uint256) {
        if (balances[addr] == 0) return 0;

        //uint256 stETHBalance = stETH.balanceOf(addr);
        return balances[addr];  // [Note]: This is ETH balance
    }

    /// @notice Allows assets to be supplied on other user's behalf using the `to` param.
    /// @param amount The amount of `token()` to be supplied
    /// @param to The user whose balance will receive the tokens
    function supplyTokenTo(uint256 amount, address to) public payable override {        
        uint256 transferredETHAmount = msg.value;
        require (transferredETHAmount != 0, "transferredETHAmount should be more than 0");
        require (amount == transferredETHAmount, "amount should be equal to transferredETHAmount");

        uint256 beforeBalance = stETH.balanceOf(address(this));

        stETH.submit{ value: transferredETHAmount }(msg.sender); 

        uint256 afterBalance = stETH.balanceOf(address(this));
        
        uint256 balanceDiff = afterBalance.sub(beforeBalance);
        balances[to] = balances[to].add(balanceDiff);
    }

    /// @notice Redeems tokens from the yield source from the msg.sender, it burn yield bearing tokens and return token to the sender.
    /// @param amount The amount of `token()` to withdraw.  Denominated in `token()` as above.
    /// @return The actual amount of tokens that were redeemed.
    function redeemToken(uint256 amount) public payable override returns (uint256) {
        uint256 stETHBeforeBalance = stETH.balanceOf(address(this));
        uint256 ETHBeforeBalance = address(this).balance;

        stETH.slash(msg.sender, ETHBeforeBalance);

        uint256 stETHAfterBalance = stETH.balanceOf(address(this));
        uint256 ETHAfterBalance = address(this).balance;

        uint256 stETHBalanceDiff = stETHBeforeBalance.sub(stETHAfterBalance);
        uint256 ETHBalanceDiff = ETHAfterBalance.sub(ETHBeforeBalance);

        balances[msg.sender] = balances[msg.sender].sub(stETHBalanceDiff);
        
        msg.sender.transfer(ETHBalanceDiff);

        return (ETHBalanceDiff);
    }

    function getETHBalance(address walletAddress) public view returns (uint _ETHBalance) {
        return walletAddress.balance;
    }

    function getStETHBalance(address walletAddress) public view returns (uint _stETHBalance) {
        return stETH.balanceOf(walletAddress);
    }
    
    

}
