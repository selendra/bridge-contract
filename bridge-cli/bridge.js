const ethers = require('ethers');
const constants = require('../constants');

const {Command} = require('commander');
const {setupParentArgs, getFunctionBytes, waitForTx, log} = require("./utils")

const EMPTY_SIG = "0x00000000"

const registerResourceCmd = new Command("register-resource")
    .description("Register a resource ID with a contract address for a handler")
    .option('--bridge <address>', 'Bridge contract address', constants.BRIDGE_ADDRESS)
    .option('--handler <address>', 'Handler address', constants.ERC20_HANDLER_ADDRESS)
    .option('--targetContract <address>', `Contract address to be registered`, constants.ERC20_ADDRESS)
    .option('--resourceId <address>', `Resource ID to be registered`, constants.ERC20_RESOURCEID)
    .action(async function (args) {
        await setupParentArgs(args, args.parent.parent)

        const bridgeInstance = new ethers.Contract(args.bridge, constants.ContractABIs.Bridge.abi, args.wallet);
        log(args,`Registering contract ${args.targetContract} with resource ID ${args.resourceId} on handler ${args.handler}`);
        const tx = await bridgeInstance.adminSetResource(args.handler, args.resourceId, args.targetContract, { gasPrice: args.gasPrice, gasLimit: args.gasLimit});
        await waitForTx(args.provider, tx.hash);
    })

const setBurnCmd = new Command("set-burn")
    .description("Set a token contract as burnable in a handler")
    .option('--bridge <address>', 'Bridge contract address', constants.BRIDGE_ADDRESS)
    .option('--handler <address>', 'ERC20 handler contract address', constants.ERC20_HANDLER_ADDRESS)
    .option('--tokenContract <address>', `Token contract to be registered`, constants.ERC20_ADDRESS)
    .action(async function (args) {
        await setupParentArgs(args, args.parent.parent)
        const bridgeInstance = new ethers.Contract(args.bridge, constants.ContractABIs.Bridge.abi, args.wallet);

        log(args,`Setting contract ${args.tokenContract} as burnable on handler ${args.handler}`);
        const tx = await bridgeInstance.adminSetBurnable(args.handler, args.tokenContract, { gasPrice: args.gasPrice, gasLimit: args.gasLimit});
        await waitForTx(args.provider, tx.hash)
    })

const cancelProposalCmd = new Command("cancel-proposal")
    .description("Cancel a proposal that has passed the expiry threshold")
    .option('--bridge <address>', 'Bridge contract address', constants.BRIDGE_ADDRESS)
    .option('--chainId <id>', 'Chain ID of proposal to cancel', 0)
    .option('--depositNonce <value>', 'Deposit nonce of proposal to cancel', 0)
    .action(async function (args) {
        await setupParentArgs(args, args.parent.parent)
        const bridgeInstance = new ethers.Contract(args.bridge, constants.ContractABIs.Bridge.abi, args.wallet);

        log(args, `Setting proposal with chain ID ${args.chainId} and deposit nonce ${args.depositNonce} status to 'Cancelled`);
        const tx = await bridgeInstance.adminCancelProposal(args.chainId, args.depositNonce);
        await waitForTx(args.provider, tx.hash)
    })

const queryProposalCmd = new Command("query-proposal")
    .description("Queries a proposal")
    .option('--bridge <address>', 'Bridge contract address', constants.BRIDGE_ADDRESS)
    .option('--chainId <id>', 'Source chain ID of proposal', 0)
    .option('--depositNonce <value>', 'Deposit nonce of proposal', 0)
    .option('--dataHash <value>', 'Hash of proposal metadata', constants.ERC20_PROPOSAL_HASH)
    .action(async function (args) {
        await setupParentArgs(args, args.parent.parent)
        const bridgeInstance = new ethers.Contract(args.bridge, constants.ContractABIs.Bridge.abi, args.wallet);

        const prop = await bridgeInstance.getProposal(args.chainId, args.depositNonce, args.dataHash)

        console.log(prop)
    })

const queryResourceId = new Command("query-resource")
    .description("Query the contract address associated with a resource ID")
    .option('--handler <address>', 'Handler contract address', constants.ERC20_HANDLER_ADDRESS)
    .option('--resourceId <address>', `ResourceID to query`, constants.ERC20_RESOURCEID)
    .action(async function(args) {
        await setupParentArgs(args, args.parent.parent)

        const handlerInstance = new ethers.Contract(args.handler, constants.ContractABIs.HandlerHelpers.abi, args.wallet)
        const address = await handlerInstance._resourceIDToTokenContractAddress(args.resourceId)
        log(args, `Resource ID ${args.resourceId} is mapped to contract ${address}`)
    })


const bridgeCmd = new Command("bridge")

bridgeCmd.addCommand(registerResourceCmd)
bridgeCmd.addCommand(setBurnCmd)
bridgeCmd.addCommand(cancelProposalCmd)
bridgeCmd.addCommand(queryProposalCmd)
bridgeCmd.addCommand(queryResourceId)

module.exports = bridgeCmd