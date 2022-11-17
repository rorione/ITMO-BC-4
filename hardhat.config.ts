import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';

require('dotenv').config({ path: __dirname + '/.env' })

const CHAIN_IDS = {
  hardhat: 5,
};
const GOERLI_KEY = process.env.GOERLI_KEY

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: CHAIN_IDS.hardhat,
      forking: {
        url: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_KEY}`, 
        blockNumber: 7941696,
      },
    },
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false,
    externalArtifacts: ['abi/*.json'],
    dontOverrideCompile: false,
  }
};

export default config;
