import fs from "fs";
import hre from "hardhat";
import { ethers } from "ethers";
import { resolve } from "path";


const BRIDGE_CONTRACT_PATH = resolve(__dirname, "../../contracts/Bridge.sol");
const ARTIFACTS_PATH = resolve(__dirname, "./Bridge.json");

export const generateAccessControlFuncSignatures = () => {
    const bridgeAbiJson = JSON.parse(fs.readFileSync(ARTIFACTS_PATH, 'utf-8'));
    const bridgeContract = fs.readFileSync(BRIDGE_CONTRACT_PATH, 'utf-8');

    const bridgeContractMethods = bridgeAbiJson.userdoc.methods

  // regex that will match all functions that have "onlyAllowed" modifier
  const regex = RegExp("function\\s+(?:(?!_onlyAllowed|function).)+onlyAllowed", "gs");

  let a;
  const b: any = [];
  // fetch all functions that have "onlyAllowed" modifier from "Bridge.sol"
  while ((a = regex.exec(bridgeContract)) !== null) {
    // filter out only function name from matching (onlyAllowed) functions
    b.push(a[0].split(/[\s()]+/)[1]);
  }

  let accessControlFuncSignatures = []
  // filter out from Bridge ABI functions signatures with "onlyAllowed" modifier
  accessControlFuncSignatures = Object.keys(bridgeContractMethods).filter(
    el1 => b.some(
      (el2: any) => el1.includes(el2))).map(
        func => ({
          function: func,
          hash: ethers.keccak256(Buffer.from(func)).substring(0,10)
    })
  );

  // console.table(accessControlFuncSignatures);

  accessControlFuncSignatures = accessControlFuncSignatures.map(e => e.hash)

  return accessControlFuncSignatures
 
}

export const accessControlFuncSignatures = generateAccessControlFuncSignatures().map(str => ethers.toUtf8Bytes(str));