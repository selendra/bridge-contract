/**
 * Copyright 2020 ChainSafe Systems
 * SPDX-License-Identifier: LGPL-3.0-only
*/

const ethers = require('ethers');

const CONTRACT_PATH = "./solidity-contract/build/contracts"
const ContractABIs = {
    Bridge: require(CONTRACT_PATH + "/Bridge.json"),
    Erc20Handler: require(CONTRACT_PATH + "/ERC20Handler.json"),
    Erc20Mintable: require(CONTRACT_PATH + "/ERC20Custom.json"),
    HandlerHelpers: require(CONTRACT_PATH + "/HandlerHelpers.json")
}
 
module.exports.ContractABIs = ContractABIs
// This is just Alice's key.
module.exports.deployerAddress = "0xff93B45308FD417dF303D6515aB04D9e89a750Ca";
module.exports.deployerPrivKey = "000000000000000000000000000000000000000000000000000000616c696365";
module.exports.relayerAddresses = [
    "0xff93B45308FD417dF303D6515aB04D9e89a750Ca", // Alice Public Address
]
 
module.exports.relayerPrivKeys = [
    "000000000000000000000000000000000000000000000000000000616c696365", // Alice Private Key
]
 
 
// These are deterministic
module.exports.BRIDGE_ADDRESS = "0x62877dDCd49aD22f5eDfc6ac108e9a4b5D2bD88B";
module.exports.ERC20_HANDLER_ADDRESS = "0x3167776db165D8eA0f51790CA2bbf44Db5105ADF";
module.exports.ERC20_ADDRESS = "0x3f709398808af36ADBA86ACC617FeB7F5B7B193E";

module.exports.DEFAULT_SOURCE_ID = 4;
module.exports.DEFAULT_DEST_ID = 1;
module.exports.DEFAULT_URL = "https://ropsten.infura.io/v3/78324f11f469479a9647bd6a75567001"
module.exports.GASLIMIT = 2000000;
module.exports.GASPRICE = 10000000000;

module.exports.ERC20_RESOURCEID = ethers.utils.hexZeroPad((this.ERC20_ADDRESS + ethers.utils.hexlify(this.DEFAULT_SOURCE_ID).substr(2)), 32);
module.exports.ERC20_PROPOSAL_HASH = "0x19b14d095647bb784f237072e14df1133fbd2008c5039c469321d77099a7b6da"