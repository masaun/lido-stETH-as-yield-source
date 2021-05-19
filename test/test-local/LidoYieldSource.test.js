const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers')

/// Artifacts
const LidoYieldSource = artifacts.require('LidoYieldSource')
const StETHMockERC20 = artifacts.require('StETHMockERC20')
//const WstETH = artifacts.require('WstETH')
//const ERC20MintableContract = artifacts.require('ERC20MintableContract')


//const { ethers } = require("hardhat");
//const { solidity } = require("ethereum-waffle");
const chai = require("chai");

//chai.use(solidity);
//const toWei = ethers.utils.parseEther;
//const toEth = ethers.utils.formatEther;
const { expect } = chai;

//let overrides = { gasLimit: 9500000 };

contract("LidoYieldSource", function(accounts) {

    function toWei(amount) {
        return web3.utils.toWei(`${ amount }`, 'ether')
    }

    function fromWei(amount) {
        return web3.utils.fromWei(`${ amount }`, 'ether')
    }

    describe("LidoYieldSource", function () {
        let wallet
        let wallet2

        let stETH
        let yieldSource
        let amount

        let ST_ETH
        let YIELD_SOURCE

        beforeEach(async function () {
            //[wallet, wallet2] = await ethers.getSigners();
            wallet = accounts[0]
            wallet2 = accounts[1]

            stETH = await StETHMockERC20.new({ from: wallet })
            ST_ETH = stETH.address

            yieldSource = await LidoYieldSource.new(ST_ETH, { from: wallet })
            YIELD_SOURCE = yieldSource.address

            amount = toWei("10")  /// [Note]: 10 
            await stETH.submit(wallet, { from: wallet })
        })

        it("setTotalShares()", async function () {
            const totalShares = toWei("1")
            let txReceipt = await stETH.setTotalShares(totalShares, { from: wallet })
        })

        it("setTotalPooledEther()", async function () {
            const totalPooledEther = toWei("1")
            let txReceipt = await stETH.setTotalPooledEther(totalPooledEther, { from: wallet })
        })

        it("submit() <- This is a test", async function () {
            const totalShares = toWei("1")
            let txReceipt1 = await stETH.setTotalShares(totalShares, { from: wallet })

            const totalPooledEther = toWei("1")
            let txReceipt2 = await stETH.setTotalPooledEther(totalPooledEther, { from: wallet })

            let txReceipt3 = await stETH.submit(wallet2, { from: wallet, value: amount })
            let stETHBalance = await stETH.balanceOf(wallet)            
            console.log('=== stETH balance of wallet ===', fromWei(stETHBalance))
        })

        it("get token address", async function () {
            let address = await yieldSource.depositToken()
            console.log('=== depositToken ===', address)
            expect(address == "0x0000000000000000000000000000000000000000")   /// ETH
        })

        it("balanceOfToken (initial deposited-token balance)", async function () {
            let ETHBalance = await yieldSource.balanceOfToken(wallet)
            console.log('=== Deposited-ETH balance of wallet ===', fromWei(ETHBalance))
            expect(String(ETHBalance)).to.eq("0")
        })

        it("supplyTokenTo", async function () {
            let ETHBalanceOfWallet = await yieldSource.getETHBalance(wallet)            
            console.log('=== ETH balance of wallet ===', fromWei(ETHBalanceOfWallet))

            await yieldSource.supplyTokenTo(amount, wallet, { from: wallet, value: amount })

            let stETHBalance = await yieldSource.getStETHBalance(YIELD_SOURCE)            
            console.log('=== stETH balance of YIELD_SOURCE ===', fromWei(stETHBalance))

            let ETHBalance = await yieldSource.balanceOfToken(wallet)
            console.log('=== Deposited-ETH balance of wallet ===', String(ETHBalance))
            expect(String(ETHBalance)).to.eq(amount)



        })

    //     it("redeemToken", async function () {
    //         await sushi.connect(wallet).approve(yieldSource.address, amount);
    //         await yieldSource.supplyTokenTo(amount, wallet.address);

    //         expect(await sushi.balanceOf(wallet.address)).to.eq(0);
    //         await yieldSource.redeemToken(amount);
    //         expect(await sushi.balanceOf(wallet.address)).to.eq(amount);
    //     });

    //     [toWei("100"), toWei("100").mul(10), toWei("100").mul(99)].forEach(function (
    //         amountToDeposit
    //     ) {
    //         it(
    //             "deposit " + toEth(amountToDeposit) + ", sushi accrues, withdrawal",
    //             async function () {
    //                 await sushi.mint(wallet.address, amountToDeposit.sub(amount));
    //                 await sushi
    //                     .connect(wallet)
    //                     .approve(yieldSource.address, amountToDeposit);
    //                 await yieldSource.supplyTokenTo(amountToDeposit, wallet.address);
    //                 // increase total balance by amount
    //                 await sushi.mint(sushiBar.address, amount);

    //                 const totalAmount = await yieldSource.callStatic.balanceOfToken(
    //                     wallet.address
    //                 );
    //                 const expectedAmount = amountToDeposit
    //                     .mul(amountToDeposit.add(amount.mul(100)))
    //                     .div(amountToDeposit.add(amount.mul(99)));
    //                 expect(totalAmount).to.eq(expectedAmount);

    //                 await yieldSource.redeemToken(totalAmount);
    //                 expect(await sushi.balanceOf(wallet.address)).to.be.closeTo(
    //                     totalAmount,
    //                     1
    //                 );
    //             }
    //         );
    //     });

    })
})

