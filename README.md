# Lido stETH integration (interest-bearing Token)

***
## 【Introduction of the Lido stETH integration】
- This is a smart contract that:

&nbsp;

***

## 【Workflow】
- Diagram of workflow

&nbsp;

***

## 【Remarks】
- Version for following the `Lido` smart contract
  - Solidity (Solc): v0.6.12
  - Truffle: v5.1.60
  - web3.js: v1.2.9
  - openzeppelin-solidity: v3.4.1
  - ganache-cli: v6.9.1 (ganache-core: 2.10.2)


&nbsp;

***

## 【Setup】
### ① Install modules
- Install npm modules in the root directory
```
npm install
```

<br>

### ② Compile & migrate contracts (on local)
```
npm run migrate:local
```

<br>

### ③ Test (Kovan testnet-fork approach)
- 1: Get API-key from Infura  
https://infura.io/

<br>

- 2: Start ganache-cli with kovan testnet-fork (using Infura Key of Kovan tesntnet)
```
ganache-cli -d --fork https://kovan.infura.io/v3/{YOUR INFURA KEY OF KOVAN}
```
(※ `-d` option is the option in order to be able to use same address on Ganache-CLI every time)  
(※ Please stop and re-start if an error of `"Returned error: project ID does not have access to archive state"` is displayed)  

<br>

- Execute test of the smart-contracts (on the local)
```
npm run test:LidoYieldSource
```
( `truffle test ./test/test-local/LidoYieldSource.test.js --network local` )  

<br>


***

## 【References】
- Lido.finance
  - [Deployed-addresses]: Mainnet & Görli testnet
     https://github.com/lidofinance/lido-dao#deployments

  - [Definition]：StETH.sol is an interest-bearing ERC20-like token
    - StETH.sol: https://github.com/lidofinance/lido-dao/blob/master/contracts/0.4.24/StETH.sol#L14
    - StETHMockERC20.sol: https://github.com/lidofinance/lido-dao/blob/master/contracts/0.6.12/mocks/StETHMockERC20.sol

<br>

- Lido - Open DeFi Hack  
https://gitcoin.co/issue/lidofinance/lido-dao/343/100025668

