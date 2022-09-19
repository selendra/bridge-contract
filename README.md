# Running Locally
## Prerequisites

## Start Local Chains

To run [`selendra chain`](https://github.com/selendra/selendra-chain/blob/main/README.md)


## Get bridge-cli and bridge-relay
To get install bridge cli and bridge relay service

```sh
make install
```

## On-Chain Setup (Ethereum)
### Deploy Contracts

To deploy the contracts on to the Ethereum chain, run the following:

_Deploy Contracts:_
```bash
bridge-cli deploy --all --relayerThreshold 1
```

After running, the expected output looks like this:
```bash
================================================================
Url:        http://localhost:8545
Deployer:   0xff93B45308FD417dF303D6515aB04D9e89a750Ca
Gas Limit:   8000000
Gas Price:   20000000
Deploy Cost: 0.0

Options
=======
Chain Id:    0
Threshold:   1
Relayers:    0xff93B45308FD417dF303D6515aB04D9e89a750Ca,0x8e0a907331554AF72563Bd8D43051C2E64Be5d35,0x24962717f8fA5BA3b931bACaF9ac03924EB475a0,0x148FfB2074A9e59eD58142822b3eB3fcBffb0cd7,0x4CEEf6139f00F9F4535Ad19640Ff7A0137708485
Bridge Fee:  0
Expiry:      100

Contract Addresses
================================================================
Bridge:             0x62877dDCd49aD22f5eDfc6ac108e9a4b5D2bD88B
----------------------------------------------------------------
Erc20 Handler:      0x3167776db165D8eA0f51790CA2bbf44Db5105ADF
----------------------------------------------------------------
Erc20:              0x21605f71845f372A9ed84253d2D024B7B10999f4
----------------------------------------------------------------
ERC20 RESOURCEID:   0x000000000000000000000000000000c84da63790f906342aa09d258680fc3b01
================================================================
```

### Register Resources Evm (Ethereum)

* **NOTE:** The below registrations will **not** notify you upon successful completion.

_Register fungile resource ID with erc20 contract:_
```bash
bridge-cli bridge register-resource \
--bridge "0x62877dDCd49aD22f5eDfc6ac108e9a4b5D2bD88B" \
--handler "0x3167776db165D8eA0f51790CA2bbf44Db5105ADF" \
--resourceId "0x000000000000000000000000000000c84da63790f906342aa09d258680fc3b01" \
--targetContract "0x21605f71845f372A9ed84253d2D024B7B10999f4"
```

### Specify Token Semantics

To allow for a variety of use cases, the EVM contracts support both the `transfer` and the `mint/burn` ERC methods.

For simplicity's sake the following examples only make use of the  `mint/burn` method:

_Register the erc20 contract as mintable/burnable:_
```bash
bridge-cli bridge set-burn \
--bridge "0x62877dDCd49aD22f5eDfc6ac108e9a4b5D2bD88B" \
--handler "0x3167776db165D8eA0f51790CA2bbf44Db5105ADF" \
--tokenContract "0x21605f71845f372A9ed84253d2D024B7B10999f4"
```
_Register the associated handler as a minter:_
```bash
bridge-cli erc20 add-minter \
--erc20Address "0x21605f71845f372A9ed84253d2D024B7B10999f4" \
--minter "0x3167776db165D8eA0f51790CA2bbf44Db5105ADF"
```

## On-Chain Setup (Selendra)

### Register Relayers

First, we need to register the account of the relayer on Selendra (bridge-cli deploys contracts with the 5 test keys preloaded). 

Steps to register the relayers:

1. Select the `Sudo` tab in the PolkadotJS Portal
2. Choose the `addRelayer` method of `chainBridge`
3. Select **Alice** as the relayer `AccountId`

### Register Resources Selendra

Steps to register resources:

1. Select the `Sudo` tab in the PolkadotJS Portal
2. Call `chainBridge.setResource`, passing both the `Id` and `Method` 
- Id: `0x000000000000000000000000000000c84da63790f906342aa09d258680fc3b01`
- Method: `0x4272696467655472616E736665722E7472616E73666572` (BridgeTransfer.transfer)

#### Whitelist Chains

Steps to whitelist chains:

1. Select the `Sudo` tab in the PolkadotJS Portal
2. Call `chainBridge.whitelistChain`, specifying `0` for the Ethereum chain ID

#### Change fee

Steps to sel Change fee:

1. Select the `Sudo` tab in the PolkadotJS Portal
2. Call `bridgeTransfer.changeFee`
- minFee: 1
- feeScale: 1
- destId: 0

## Run Relayer

Steps to run a relayer:

1. Install the selendra-bridge binary
2. Create `config.json` using the sample provided below as a starting point
3. Start relayer as a binary using the default "Alice" key


_Go to bridge diretory:_
```bash
cd selendra-bridge
```
_Run relayer_:
```bash
chainbridge --config config.json --testkey alice --latest
```

Sample `config.json`:
```json
{
  "chains": [
    {
      "name": "eth",
      "type": "ethereum",
      "id": "0",
      "endpoint": "ws://localhost:8545",
      "from": "0xff93B45308FD417dF303D6515aB04D9e89a750Ca",
      "opts": {
        "bridge": "0x62877dDCd49aD22f5eDfc6ac108e9a4b5D2bD88B",
        "erc20Handler": "0x3167776db165D8eA0f51790CA2bbf44Db5105ADF",
        "gasLimit": "1000000",
        "maxGasPrice": "20000000"
      }
    },
    {
      "name": "sub",
      "type": "substrate",
      "id": "1",
      "endpoint": "ws://localhost:9944",
      "from": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      "opts": {
          "useExtendedCall":"true"
      }
    }
  ]
}
```
- This is an example config file for a single relayer ("Alice") using the contracts we've deployed.

### Selendra Native Token ⇒ ERC20

Steps to transfer an ERC-20 token:

1. Select the `Extrinsics` tab in the PolkadotJS Portal
2. Call `bridgeTransfer.transferNative` with parameters such as these:
    - Amount: `1000` **(select `Pico` for units)**
    - Recipient: `0xff93B45308FD417dF303D6515aB04D9e89a750Ca`
    - Dest Id: `0`

You can query the recipients balance on Evm with this:

_Query token balance of account: Oxff..750Ca_:
```bash
bridge-cli erc20 balance --address "0xff93B45308FD417dF303D6515aB04D9e89a750Ca"
```

### ERC20 ⇒ Selendra Native Token

Before initiating the transfer we have to approve the bridge to take ownership of the tokens:
_Approve bridge to assume custody of tokens:_
```bash
bridge-cli erc20 approve \
--amount 1000 \
--erc20Address "0x21605f71845f372A9ed84253d2D024B7B10999f4" \
--recipient "0x3167776db165D8eA0f51790CA2bbf44Db5105ADF"
```
To initiate a transfer on the Evm chain use this command (Note: there will be a 10 block delay before the relayer will process the transfer):

_Transfer 1 token to account: 0xd4..da27d_:
```bash
bridge-cli erc20 deposit \
--bridge "0x62877dDCd49aD22f5eDfc6ac108e9a4b5D2bD88B" \
--recipient "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d" \
--amount 30 \
--dest 1 \
--resourceId "0x000000000000000000000000000000c84da63790f906342aa09d258680fc3b01"
```

_Note_: to get recipient (0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d)
```bash
const { u8aToHex } = require('@polkadot/util');
recipient = u8aToHex(wallet.publicKey)
```
