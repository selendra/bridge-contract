import hre from "hardhat";
import { generateAccessControlFuncSignatures, getDomainId } from "./utils";

async function main() {
  const deploy = await hre.ethers.getSigner(
    "0x5bCae15E6EB33C4E54b0738bAeb895Fc3aDF8d85"
  );
  const domainId = await getDomainId();
  const functionAccessAddresses = Array(13).fill(deploy.address);
  const accessControlFuncSignatures = generateAccessControlFuncSignatures();

  // Utility contract
  const AccessControlSegregatorContract = await hre.ethers.getContractFactory(
    "AccessControlSegregator"
  );
  const PausableContract = await hre.ethers.getContractFactory(
    "PausableBridge"
  );

  // Bridge contract
  const BridgeContract = await hre.ethers.getContractFactory("Bridge");

  // Erc20 Handler contract
  const DefaultMessageReceiverContract = await hre.ethers.getContractFactory(
    "DefaultMessageReceiver"
  );
  const ERC20HandlerContract = await hre.ethers.getContractFactory(
    "ERC20Handler"
  );

  // Fee handler contract
  const FeeRouterContract = await hre.ethers.getContractFactory(
    "FeeHandlerRouter"
  );
  const BasicFeeHandlerContract = await hre.ethers.getContractFactory(
    "BasicFeeHandler"
  );
  const PercentageFeeHandler = await hre.ethers.getContractFactory(
    "PercentageERC20FeeHandler"
  );

  // accessControl Segregator contract
  const accessControlSegregatorInstance =
    await AccessControlSegregatorContract.deploy(
      accessControlFuncSignatures,
      functionAccessAddresses
    );
  const accessControlAddr = await accessControlSegregatorInstance.getAddress();

  // Pause contract for bridge
  await PausableContract.deploy();

  // Bridge contract
  const bridgeInstance = await BridgeContract.deploy(
    domainId,
    accessControlAddr
  );
  const bridgeAddr = await bridgeInstance.getAddress();

  // Erc20 MessageReceiver contratc
  const defaultMessageReceiverInstance =
    await DefaultMessageReceiverContract.deploy([], 100000);
  const defaultMessageReceiverAddr =
    await defaultMessageReceiverInstance.getAddress();

  // Erc20 MessageReceiver contratc
  const erc20HandlerInstance = await ERC20HandlerContract.deploy(
    bridgeAddr,
    defaultMessageReceiverAddr
  );
  const erc20HandlerAddr = await erc20HandlerInstance.getAddress();

  // Fee Handler contratc
  const feeRouterInstance = await FeeRouterContract.deploy(bridgeAddr);
  const feeRouterAddr = await feeRouterInstance.getAddress();

  const basicFeeHandlerInstance = await BasicFeeHandlerContract.deploy(
    bridgeAddr,
    feeRouterAddr
  );
  const basicFeeHandlerAddr = await basicFeeHandlerInstance.getAddress();

  const percentageFeeHandlerInstance = await PercentageFeeHandler.deploy(
    bridgeAddr,
    feeRouterAddr
  );
  const percentageFeeHandlerAddr =
    await percentageFeeHandlerInstance.getAddress();

  // const bridge = await hre.ethers.getContractAt("Bridge", bridgeAddr);
  await bridgeInstance.adminChangeFeeHandler(feeRouterAddr, {
    gasLimit: 2000000,
  });

  await defaultMessageReceiverInstance.grantRole(
    await defaultMessageReceiverInstance.SYGMA_HANDLER_ROLE(),
    erc20HandlerAddr
  );

  console.table({
    "Deployer Address": deploy.address,
    "Domain ID": domainId,
    "Bridge Address": bridgeAddr,
    "DefaultMessageReceiver Address": defaultMessageReceiverAddr,
    "ERC20Handler Address": erc20HandlerAddr,
    "FeeRouterContract Address": feeRouterAddr,
    "BasicFeeHandler Address": basicFeeHandlerAddr,
    "PercentageFeeHandler Address": percentageFeeHandlerAddr,
  });

  console.log("🎉🎉🎉 Sygma bridge successfully configured 🎉🎉🎉", "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
