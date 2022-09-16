const { decodeAddress } = require('@polkadot/util-crypto');
const { u8aToHex } = require('@polkadot/util');

function getHex(substrateAdress){
    const publicKey = decodeAddress(substrateAdress);
    const hexPublicKey = u8aToHex(publicKey);
    console.log(hexPublicKey)
    return hexPublicKey
}

getHex('5DXeoHY4wiz7uq5dxvyxNBJc3ECUgnBWdwCKacdf9RaY1kRo');