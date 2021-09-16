const ethers = require('ethers');
const {Command} = require('commander');
const constants = require('../constants');
const {setupParentArgs, splitCommaList} = require("./utils")

const deployCmd = new Command("deploy")
    .description("Deploys contracts via RPC")
    .option('--chainId <value>', 'Chain ID for the instance', constants.DEFAULT_SOURCE_ID)
    .option('--relayers <value>', 'List of initial relayers', splitCommaList, constants.relayerAddresses)
    .option('--relayerThreshold <value>', 'Number of votes required for a proposal to pass', 2)
    .option('--fee <ether>', 'Fee to be taken when making a deposit (decimals allowed)', 0)
    .option('--expiry <blocks>', 'Numer of blocks after which a proposal is considered cancelled', 100)
    .option('--all', 'Deploy all contracts')
    .option('--bridge', 'Deploy bridge contract')
    .option('--erc20Handler', 'Deploy erc20Handler contract')
    .option('--erc20', 'Deploy erc20 contract')
    .action(async (args) => {
        await setupParentArgs(args, args.parent)
        let startBal = await args.provider.getBalance(args.wallet.address)
        console.log("Deploying contracts...")
        if(args.all) {
            await deployBridgeContract(args);
            await deployERC20Handler(args);
            await deployERC20(args)
        } else {
            let deployed = false
            if (args.bridge) {
                await deployBridgeContract(args);
                deployed = true
            }
            if (args.erc20Handler) {
                await deployERC20Handler(args);
                deployed = true
            }
            if (args.erc20) {
                await deployERC20(args)
                deployed = true
            }
            if (!deployed) {
                throw new Error("must specify --all or specific contracts to deploy")
            }
        }

        args.cost = startBal.sub((await args.provider.getBalance(args.wallet.address)))
        displayLog(args)
    })


const displayLog = (args) => {
    console.log(`
================================================================
Url:        ${args.url}
Deployer:   ${args.wallet.address}
Gas Limit:   ${ethers.utils.bigNumberify(args.gasLimit)}
Gas Price:   ${ethers.utils.bigNumberify(args.gasPrice)}
Deploy Cost: ${ethers.utils.formatEther(args.cost)}
Options
=======
Chain Id:    ${args.chainId}
Threshold:   ${args.relayerThreshold}
Relayers:    ${args.relayers}
Bridge Fee:  ${args.fee}
Expiry:      ${args.expiry}
Contract Addresses
================================================================
Bridge:             ${args.bridgeContract ? args.bridgeContract : "Not Deployed"}
----------------------------------------------------------------
Erc20 Handler:      ${args.erc20HandlerContract ? args.erc20HandlerContract : "Not Deployed"}
----------------------------------------------------------------
Erc20:              ${args.erc20Contract ? args.erc20Contract : "Not Deployed"}
----------------------------------------------------------------
ERC20 RESOURCEID:   ${ethers.utils.hexZeroPad((args.erc20Contract + ethers.utils.hexlify(args.chainId).substr(2)), 32)}
================================================================
    `)
}


async function deployBridgeContract(args) {
    // Create an instance of a Contract Factory
    let factory = new ethers.ContractFactory(constants.ContractABIs.Bridge.abi, constants.ContractABIs.Bridge.bytecode, args.wallet);

    // Deploy
    let contract = await factory.deploy(
        args.chainId,
        args.relayers,
        args.relayerThreshold,
        ethers.utils.parseEther(args.fee.toString()),
        args.expiry,
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}

    );
    await contract.deployed();
    args.bridgeContract = contract.address
    console.log("✓ Bridge contract deployed")
}

async function deployERC20(args) {
    const factory = new ethers.ContractFactory(constants.ContractABIs.Erc20Mintable.abi, constants.ContractABIs.Erc20Mintable.bytecode, args.wallet);
    const contract = await factory.deploy("", "", { gasPrice: args.gasPrice, gasLimit: args.gasLimit});
    await contract.deployed();
    args.erc20Contract = contract.address
    console.log("✓ ERC20 contract deployed")
}

async function deployERC20Handler(args) {
    const factory = new ethers.ContractFactory(constants.ContractABIs.Erc20Handler.abi, constants.ContractABIs.Erc20Handler.bytecode, args.wallet);


    const contract = await factory.deploy(args.bridgeContract, [], [], [], { gasPrice: args.gasPrice, gasLimit: args.gasLimit});
    await contract.deployed();
    args.erc20HandlerContract = contract.address
    console.log("✓ ERC20Handler contract deployed")
}

module.exports = deployCmd