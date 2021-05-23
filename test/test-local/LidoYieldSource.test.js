const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Chai for test
const chai = require("chai")
const { expect } = chai

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers')

/// Artifacts
const LidoYieldSource = artifacts.require('LidoYieldSource')
const StETHMockERC20 = artifacts.require('StETHMockERC20')


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

        it("get deposit token address should be ETH address (0x0000000000000000000000000000000000000000)", async function () {
            let address = await yieldSource.depositToken()
            console.log('=== depositToken (ETH) ===', address)
            expect(address == "0x0000000000000000000000000000000000000000")   /// ETH
        })

        it("balanceOfToken (initial deposited-token balance) should be 0", async function () {
            let ETHBalance = await yieldSource.balanceOfToken(wallet)
            console.log('=== Deposited-ETH balance of the wallet ===', fromWei(ETHBalance))
            expect(String(ETHBalance)).to.eq("0")
        })

        it("supplyTokenTo()", async function () {
            /// [Note]: setTotalShares() and setTotalPooledEther() are also executed in this part. Because it doesn't work if it is executed in global
            const totalShares = toWei("1")
            let txReceipt1 = await stETH.setTotalShares(totalShares, { from: wallet })

            const totalPooledEther = toWei("1")
            let txReceipt2 = await stETH.setTotalPooledEther(totalPooledEther, { from: wallet })

            await yieldSource.supplyTokenTo(amount, wallet, { from: wallet, value: amount })

            let stETHBalance = await yieldSource.getStETHBalance(YIELD_SOURCE)            
            console.log('=== stETH balance of the LidoYieldSource contract ===', fromWei(stETHBalance))
            expect(fromWei(stETHBalance)).to.eq(
                fromWei(amount)
            )

            let ETHBalance = await yieldSource.balanceOfToken(wallet)
            console.log('=== Deposited-ETH balance of the wallet ===', fromWei(ETHBalance))
            expect(fromWei(ETHBalance)).to.eq(
                fromWei(amount)
            )
        })

        it("redeemToken()", async function () {
            await yieldSource.redeemToken(amount, { from: wallet})
            let ETHBalance = await yieldSource.getETHBalance(wallet)
            console.log('=== ETHBalance (after redeemToken) ===', fromWei(ETHBalance))
        })
    })
})

