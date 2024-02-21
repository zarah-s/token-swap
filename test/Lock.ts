import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {


    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const TokenA = await ethers.getContractFactory("Token");
    const tokenA = await TokenA.deploy()
    const TokenB = await ethers.getContractFactory("Token");
    const tokenB = await TokenB.connect(owner).deploy()


    const Swap = await ethers.getContractFactory("Swap");
    const swap = await Swap.deploy(tokenA.target, tokenB.target)

    return { swap, owner, tokenA, tokenB, otherAccount };
  }

  describe("Deployment", function () {
    it("Should check if tokens are deployed", async function () {
      const { swap } = await loadFixture(deployOneYearLockFixture);
      expect((await swap.getTokenAddresses()).length).eq(2);
    });

    it("Should set the right owner", async function () {
      const { swap, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await swap.owner()).to.equal(owner.address);
    });

  });




  describe("Swap", function () {
    describe("Swap Token A", async function () {
      it("Should deduct  from address, token A balance", async function () {
        const { swap, tokenA, tokenB, owner } = await loadFixture(deployOneYearLockFixture);
        const swapAmount = 2;
        await (await tokenB.transfer(swap.target, BigInt(10000000000000000000))).wait();
        await (await tokenA.approve(swap.target, BigInt(5000000000000000000))).wait()
        await (await swap.swapToken(tokenA.target, swapAmount, tokenB.target)).wait()
        expect((await tokenA.balanceOf(owner.address)).toString()).eq("99998000000000000000000")

      });

      it("Should Increase address token B balance", async function () {
        const { swap, tokenA, tokenB, owner } = await loadFixture(deployOneYearLockFixture);
        const swapAmount = 2;
        await (await tokenB.transfer(swap.target, BigInt(10000000000000000000))).wait();
        await (await tokenA.approve(swap.target, BigInt(5000000000000000000))).wait()
        await (await swap.swapToken(tokenA.target, swapAmount, tokenB.target)).wait()
        expect((await tokenB.balanceOf(owner.address)).toString()).eq((4000000000000000000n).toString())

      });

      it("Should Increase swap contract balance", async function () {
        const { swap, tokenA, tokenB } = await loadFixture(deployOneYearLockFixture);
        const swapAmount = 2;
        await (await tokenB.transfer(swap.target, BigInt(10000000000000000000))).wait();
        await (await tokenA.approve(swap.target, BigInt(5000000000000000000))).wait()
        await (await swap.swapToken(tokenA.target, swapAmount, tokenB.target)).wait()
        expect((await tokenA.balanceOf(swap.target)).toString()).eq((2000000000000000000n).toString())

      });


    })




    describe("Swap Token B", async function () {
      it("Should deduct  from address, token B balance", async function () {
        const { swap, tokenA, tokenB, owner } = await loadFixture(deployOneYearLockFixture);
        const swapAmount = 2;
        await (await tokenA.transfer(swap.target, BigInt(10000000000000000000))).wait();
        await (await tokenB.approve(swap.target, BigInt(5000000000000000000))).wait()
        await (await swap.swapToken(tokenB.target, swapAmount, tokenA.target)).wait()
        expect((await tokenB.balanceOf(owner.address)).toString()).eq("99998000000000000000000")

      });

      it("Should Increase address token B balance", async function () {
        const { swap, tokenA, tokenB, owner } = await loadFixture(deployOneYearLockFixture);
        const swapAmount = 2;
        await (await tokenA.transfer(swap.target, BigInt(10000000000000000000))).wait();
        await (await tokenB.approve(swap.target, BigInt(5000000000000000000))).wait()
        await (await swap.swapToken(tokenB.target, swapAmount, tokenA.target)).wait()
        expect((await tokenB.balanceOf(owner.address)).toString()).eq((99998000000000000000000n).toString())

      });

      it("Should Increase swap contract balance", async function () {
        const { swap, tokenA, tokenB } = await loadFixture(deployOneYearLockFixture);
        const swapAmount = 2;
        await (await tokenA.transfer(swap.target, BigInt(10000000000000000000))).wait();
        await (await tokenB.approve(swap.target, BigInt(5000000000000000000))).wait()
        await (await swap.swapToken(tokenB.target, swapAmount, tokenA.target)).wait()
        expect((await tokenA.balanceOf(swap.target)).toString()).eq((2000000000000000000n).toString())

      });


    })


  });





});
