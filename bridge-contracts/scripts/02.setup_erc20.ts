import hre from "hardhat";
import { ethers } from "ethers";
import { createResourceID, erc20Interface, getDomainId } from "./utils";

const setupErc20 = async (
  erc20: erc20Interface,
  bridgeAddress: string,
  erc20HandlerAddress: string,
  domainID: number,
) => {
  const [deploy] = await hre.ethers.getSigners();
  
  let erc20Instance;
  if (!erc20.address) {
    const ERC20PresetMinterPauser = await hre.ethers.getContractFactory(
      "ERC20PresetMinterPauserDecimals"
    );

    erc20Instance = await ERC20PresetMinterPauser.deploy(
      erc20.name,
      erc20.symbol,
      erc20.decimals
    );
    erc20.address = await erc20Instance.getAddress();
    erc20.resourceID = createResourceID(erc20.address, domainID);
  } else {
    erc20Instance = await hre.ethers.getContractAt(
      "ERC20PresetMinterPauserDecimals",
      erc20.address
    );
  }

  await erc20Instance.mint(deploy.address, ethers.parseUnits("10000", 18));

  // strategy can be either mb (mint/burn) or lr (lock/release)
  if (erc20.strategy == "mb") {
    await erc20Instance.grantRole(
      await erc20Instance.MINTER_ROLE(),
      erc20HandlerAddress
    );
    const bridge = await hre.ethers.getContractAt("Bridge", bridgeAddress);
    await bridge.adminSetBurnable(erc20HandlerAddress, erc20.address);
  }

  console.table({
    "ERC20 address": erc20.address,
    "ResourceID": erc20.resourceID,
    "Decimal places": erc20.decimals,
  });
};

async function main() {
  let erc20: erc20Interface = {
    name: "testToken_1",
    symbol: "TK1",
    decimals: 18,
    strategy: "mb",
    resourceID:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
  };
  await setupErc20(erc20, "", "", await getDomainId());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
