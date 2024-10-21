import hre from "hardhat";
import { ethers } from "ethers";
import { erc20Interface } from "./utils";

const bridgeRegister = async (
  erc20: erc20Interface,
  bridgeAddress: string,
  erc20HandlerAddress: string
) => {
  const bridge = await hre.ethers.getContractAt("Bridge", bridgeAddress);
  if (erc20.address) {
    await bridge.adminSetResource(
      erc20HandlerAddress,
      erc20.resourceID,
      erc20.address,
      ethers.toBeHex(erc20.decimals),
      { gasLimit: 2000000 }
    );

    console.log("🎉🎉🎉 set bridge resource successfully configured 🎉🎉🎉", "\n");
  }
};

async function main() {
  let erc20: erc20Interface = {
    address: "",
    name: "testToken_1",
    symbol: "TK1",
    decimals: 18,
    strategy: "mb",
    resourceID:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
  };
  await bridgeRegister(erc20, "", "");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
