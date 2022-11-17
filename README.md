# Blockchain HW 4

This project demonstrates swapping two custom ERC tokens in Goerli fork.

## To run tests:
1. Add .env file fith following content:
```
GOERLI_KEY={YOUR_ALCHEMY_GOERLY_KEY}
```
2. Run following command:
```shell
npx hardhat test
```
## Swap output example:
```
  Swap test
router allowance - salt: 2000, sugar: 2000
Before liquidity added balance: 10000 salt, 10000 sugar
Added 1500 liquidity
After liquidity added balance: 8500 salt, 8500 sugar
Swapping 100 SLT to at least 90 SGR
After swap balance: 8400 salt, 8593 sugar
    ✔ After deployment swap should be completed (237ms)
```