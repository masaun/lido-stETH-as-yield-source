# Lido's stETH as a yield source of PoolTogether🎫🎟
## 【Introduction of the Lido's stETH as a yield source of PoolTogether】
- This is a smart contract that can utilize Lido's stETH as a yield source of PoolTogether.
  - Currently, several interest-bearing tokens such as Compound Token (e.g. cDAI), xSushi, AAVE Token (e.g. aDAI) is used as yield source of PoolTogether.
    https://docs.pooltogether.com/protocol/yield-sources

  - `stETH` is also a `interest-bearing token` (which is minted by depositing ETH as underlying asset). Therefore, stETH is suitable to be used as a yield source of PoolTogether.
  
  - This repo is a integration between Lido's stETH and PoolTogether yieid source interface. 

&nbsp;

***

## 【Workflow】
- Diagram of workflow
  (Note: This repo is that only part of green one below is implemented)
![【Diagram】Lido's stETH as a yield source of PoolTogether](https://user-images.githubusercontent.com/19357502/119280329-e7b73c00-bc6b-11eb-8b11-58ac992f86e8.jpg)

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

### ③ Test (on local)
- 1: Start ganache-cli
```
ganache-cli -d
```
(※ `-d` option is the option in order to be able to use same address on Ganache-CLI every time)  
(※ Please stop and re-start if an error of `"Returned error: project ID does not have access to archive state"` is displayed)  

<br>

- 2: Execute test of the smart-contracts
```
npm run test:LidoYieldSource
```
( `truffle test ./test/test-local/LidoYieldSource.test.js --network local` )  

<br>

## 【Demo】
- Video demo of test above.  
https://youtu.be/dBGuZbPMlyA

<br>

***

## 【References】
- Lido.finance
  - Doc: https://docs.lido.fi/

  - [Deployed-addresses]: Mainnet & Görli testnet  
    https://github.com/lidofinance/lido-dao#deployments

  - Smart contract: https://github.com/lidofinance/lido-dao/tree/master/contracts
    - StETH.sol: https://github.com/lidofinance/lido-dao/blob/master/contracts/0.4.24/StETH.sol#L14
    - StETHMockERC20.sol: https://github.com/lidofinance/lido-dao/blob/master/contracts/0.6.12/mocks/StETHMockERC20.sol

<br>

- PoolTogether
  - Yield Source Interface: https://github.com/pooltogether/yield-source-interface
  - Doc (Explanation about PoolTogether yield source): https://docs.pooltogether.com/protocol/yield-sources
  - Workshop: https://www.youtube.com/watch?v=sTsMt0zdOHY

<br>

- Lido - Open DeFi Hack  
https://gitcoin.co/issue/lidofinance/lido-dao/343/100025668

