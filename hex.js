const { decodeAddress } = require('@polkadot/util-crypto');
const { u8aToHex } = require('@polkadot/util');

function getHex(substrateAdress){
    const publicKey = decodeAddress(substrateAdress);
    const hexPublicKey = u8aToHex(publicKey);
    console.log(hexPublicKey)
}

getHex("5Eo5UWonGx75gTnEFRi6A3So5qfHGP4dL1ZFcHAc6fonYKKd")