import chai from "chai";
import { ethers 
       } from 'hardhat'

import { SaltToken__factory
       , SugarToken__factory
       , Uniswap_router__factory
       , Uniswap_factory__factory
       } from '../types/index'

const { expect } = chai

const overrides = {
  gasLimit: 9999999
}

describe("Base token test", () => {
  it("Deployment salt should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("SaltToken") as SaltToken__factory;
    const token = await Token.deploy();

    const ownerBalance = await token.balanceOf(owner.address);
    
    expect(await token.totalSupply()).to.equal(ownerBalance);
    console.log("Salt owner balance equal to %d", ownerBalance)
  });
  it("Deployment sugar should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const TokenF = await ethers.getContractFactory("SaltToken") as SaltToken__factory;
    const token = await TokenF.deploy();

    const ownerBalance = await token.balanceOf(owner.address);
    
    expect(await token.totalSupply()).to.equal(ownerBalance);
    console.log("Salt owner balance equal to %d", ownerBalance)
  });
});

describe("Swap test", () => {
  const uniswapAddr = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
  const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"

  it("After deployment swap should be completed", async function () {
    // Block
    const blockNum = ethers.provider.getBlockNumber()
    const block = await ethers.provider.getBlock(blockNum)
    
    // User
    const [owner] = await ethers.getSigners();

    // Factories
    const SaltF = await ethers.getContractFactory("SaltToken") as SaltToken__factory;
    const SugarF = await ethers.getContractFactory("SugarToken") as SugarToken__factory;

    // Tokens
    const salt = await SaltF.deploy();
    const sugar = await SugarF.deploy();
    
    // Uniswap
    const UniswapF = Uniswap_factory__factory.connect(uniswapAddr, owner);
    await UniswapF.createPair(salt.address, sugar.address);
    const router = Uniswap_router__factory.connect(routerAddress, owner);

    // Approves
    const allowance = 2000;

    await salt.approve(router.address, allowance);
    await sugar.approve(router.address, allowance);
    const saltAllowance = await salt.allowance(owner.getAddress(), router.address);
    const sugarAllowance = await sugar.allowance(owner.getAddress(), router.address);
    
    console.log("router allowance - salt: %s, sugar: %s", saltAllowance, sugarAllowance);
    
    expect(saltAllowance).to.equal(allowance)
    expect(sugarAllowance).to.equal(allowance)

    // Liquidity
    const liquidity = 1500;
    
    const totalSalt = await salt.balanceOf(owner.getAddress());
    const totalSugar = await sugar.balanceOf(owner.getAddress());
    console.log("Before liquidity added balance: %s salt, %s sugar", totalSalt, totalSugar);

    await router.addLiquidity(
      salt.address,
      sugar.address, 
      liquidity, liquidity, 
      0, 0,
      owner.getAddress(), block.timestamp + 120,
      overrides
    );
    console.log("Added %s liquidity", liquidity)
    
    const afterLiquidityAddedSalt = await salt.balanceOf(owner.getAddress());
    const afterLiquidityAddedSugar = await sugar.balanceOf(owner.getAddress());
    console.log("After liquidity added balance: %s salt, %s sugar", afterLiquidityAddedSalt, afterLiquidityAddedSugar);

    // Swap
    const saltToSwap = 100;
    const sugarMin = 10;

    await router.swapExactTokensForTokens(
      saltToSwap, sugarMin, 
      [salt.address, sugar.address], 
      owner.getAddress(), block.timestamp + 120,
      overrides
    );

    const newSaltBalance = await salt.balanceOf(owner.getAddress());
    const newSugarBalance = await sugar.balanceOf(owner.getAddress());
    console.log("After swap balance: %s salt, %s sugar", newSaltBalance, newSugarBalance);
    
    expect(newSaltBalance).to.equal(afterLiquidityAddedSalt.sub(saltToSwap))
    expect(newSugarBalance).to.greaterThan(afterLiquidityAddedSugar.add(sugarMin))
  })
});