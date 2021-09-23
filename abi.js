const fs = require('fs');
const contract = JSON.parse(fs.readFileSync('./solidity-contract/build/contracts/SELToken.json', 'utf8'));
// console.log(JSON.stringify(contract.abi));
console.log(JSON.stringify(contract.bytecode));

