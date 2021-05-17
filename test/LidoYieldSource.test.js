const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers')

/// Artifacts
const LidoYieldSource = artifacts.require('LidoYieldSource')
const StETHMockERC20 = artifacts.require('StETHMockERC20')
const WstETH = artifacts.require('WstETH')
const ERC20MintableContract = artifacts.require('ERC20MintableContract')


//const { ethers } = require("hardhat");
//const { solidity } = require("ethereum-waffle");
//const chai = require("chai");

//chai.use(solidity);
//const toWei = ethers.utils.parseEther;
//const toEth = ethers.utils.formatEther;
//const { expect } = chai;

//let overrides = { gasLimit: 9500000 };

describe("LidoYieldSource", function () {
  let stETH;
  let wstETH;
  let wallet;
  let wallet2;
  let yieldSource;
  let amount;

  beforeEach(async function () {
    //[wallet, wallet2] = await ethers.getSigners();
    wallet = accounts[0]
    wallet2 = accounts[1]

    const ERC20MintableContract = await .getContractFactory(
      "ERC20Mintable",
      wallet,
      overrides
    );
    sushi = await ERC20MintableContract.deploy("Sushi", "SUSHI");

    const SushiBarContract = await hre.ethers.getContractFactory(
      "SushiBar",
      wallet,
      overrides
    );
    sushiBar = await SushiBarContract.deploy(sushi.address);

    const SushiYieldSourceContract = await ethers.getContractFactory(
      "SushiYieldSource"
    );
    yieldSource = await SushiYieldSourceContract.deploy(
      sushiBar.address,
      sushi.address,
      overrides
    );
    amount = toWei("100");
    await sushi.mint(wallet.address, amount);
    await sushi.mint(wallet2.address, amount.mul(99));
    await sushi.connect(wallet2).approve(sushiBar.address, amount.mul(99));
    await sushiBar.connect(wallet2).enter(amount.mul(99));
  });

  it("get token address", async function () {
    let address = await yieldSource.depositToken();
    expect(address == sushi);
  });

  it("balanceOfToken", async function () {
    expect(await yieldSource.callStatic.balanceOfToken(wallet.address)).to.eq(
      0
    );

    await sushi.connect(wallet).approve(yieldSource.address, amount);
    await yieldSource.supplyTokenTo(amount, wallet.address);
    expect(await yieldSource.callStatic.balanceOfToken(wallet.address)).to.eq(
      amount
    );
  });

  it("supplyTokenTo", async function () {
    await sushi.connect(wallet).approve(yieldSource.address, amount);
    await yieldSource.supplyTokenTo(amount, wallet.address);
    expect(await sushi.balanceOf(sushiBar.address)).to.eq(amount.mul(100));
    expect(await yieldSource.callStatic.balanceOfToken(wallet.address)).to.eq(
      amount
    );
  });

  it("redeemToken", async function () {
    await sushi.connect(wallet).approve(yieldSource.address, amount);
    await yieldSource.supplyTokenTo(amount, wallet.address);

    expect(await sushi.balanceOf(wallet.address)).to.eq(0);
    await yieldSource.redeemToken(amount);
    expect(await sushi.balanceOf(wallet.address)).to.eq(amount);
  });

  [toWei("100"), toWei("100").mul(10), toWei("100").mul(99)].forEach(function (
    amountToDeposit
  ) {
    it(
      "deposit " + toEth(amountToDeposit) + ", sushi accrues, withdrawal",
      async function () {
        await sushi.mint(wallet.address, amountToDeposit.sub(amount));
        await sushi
          .connect(wallet)
          .approve(yieldSource.address, amountToDeposit);
        await yieldSource.supplyTokenTo(amountToDeposit, wallet.address);
        // increase total balance by amount
        await sushi.mint(sushiBar.address, amount);

        const totalAmount = await yieldSource.callStatic.balanceOfToken(
          wallet.address
        );
        const expectedAmount = amountToDeposit
          .mul(amountToDeposit.add(amount.mul(100)))
          .div(amountToDeposit.add(amount.mul(99)));
        expect(totalAmount).to.eq(expectedAmount);

        await yieldSource.redeemToken(totalAmount);
        expect(await sushi.balanceOf(wallet.address)).to.be.closeTo(
          totalAmount,
          1
        );
      }
    );
  });
});
