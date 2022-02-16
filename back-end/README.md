# Back-End Code

Project Based on Truffle, Ganache, Solidity and Ethereum.

Blockchain config:
- solc version: "0.8.10",
- host: "127.0.0.1",
- port: 7545,           
- network_id: "1337"
- mnemonic: table stairs whale remember fetch arctic hazard term vehicle memory negative scrap


## To compile the contracts
```
truffle compile
```

## To deploy the contracts on the blockchain:
```
truffle migrate --reset
```
Every time you will change the contract code and re-compile + re-deploy, you have to copy the compiled contract ABI file into the frontend folder.

## To run Unit test
```
truffle test
```







