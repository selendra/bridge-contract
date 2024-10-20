import hre from "hardhat";
import { generateAccessControlFuncSignatures, getDomainId } from "./utils";

async function main() {
  const deploy = await hre.ethers.getSigner("0x5bCae15E6EB33C4E54b0738bAeb895Fc3aDF8d85");
  const domainId = await getDomainId();

  const AccessControlSegregatorContract = await hre.ethers.getContractFactory("AccessControlSegregator");
  const BridgeContract = await hre.ethers.getContractFactory("Bridge");

  // assign addresses for access segregation
  const functionAccessAddresses = Array(13).fill(deploy.address);

  const accessControlFuncSignatures = generateAccessControlFuncSignatures();

  const accessControlSegregatorInstance = await AccessControlSegregatorContract.deploy(
    accessControlFuncSignatures,
    functionAccessAddresses,
  );
  const accessControlAddr = await accessControlSegregatorInstance.getAddress()

  const bridgeInstance = await BridgeContract.deploy(
    domainId,
    accessControlAddr
  );
  const abridgeAddr = await bridgeInstance.getAddress()

  console.table({
    "Deployer Address": deploy.address,
    "Domain ID": domainId,
    "Bridge Address": abridgeAddr,
  });
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });