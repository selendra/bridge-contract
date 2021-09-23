# selendra bridge-cli
This CLI supports on-chain interactions with components of selendra-bridge.

## Installation 

Installation requires the ABI files from the contracts which will be fetched and built from the chainbridge-solidity repo.
```
$ make install
```

## Usage 

The root command (`bridge-cli`) has some options:
```
--url <value>                 URL to connect to
--gasLimit <value>            Gas limit for transactions 
--gasPrice <value>            Gas price for transactions 
--networkId <value>	      Network id
```
\
The keypair used for interactions can be configured with:
```
--privateKey <value>           Private key to use
```
or
```
--jsonWallet <path>           Encrypted JSON wallet
--jsonWalletPassword <value>  Password for encrypted JSON wallet
```

There are multiple subcommands provided:

- [`deploy`](docs/deploy.md): Deploys contracts via RPC
- [`bridge`](docs/bridge.md): Interactions with the bridge contract such as registering resource IDs and handler addresses
- [`admin`](docs/admin.md): Interactions with the bridge contract for administering relayer set, relayer threshold, fees and more.
- [`erc20`](docs/erc20.md): Interactions with ERC20 contracts and handlers
- [`erc721`](docs/erc721.md): Interactions with ERC721 contracts and handler

### Example
- deploy all
```
bridge-cli deploy --all --relayerThreshold 1
```
- register resource
```
bridge-cli bridge register-resource \
--bridge "0x1A27e1a295E40c7737D77A4e1D6A7FD0140Ea766" \
--handler "0x8638217adE469A835A18C73144252193d91FEba4" \
--resourceId "0x000000000000000000000079BF20B3F3b70A68E2aAE59603467fE0A6F242Ee2a" \
--targetContract "0x79BF20B3F3b70A68E2aAE59603467fE0A6F242Ee"
```
- set burn
```
bridge-cli bridge set-burn \
--bridge "0x1A27e1a295E40c7737D77A4e1D6A7FD0140Ea766" \
--handler "0x8638217adE469A835A18C73144252193d91FEba4" \
--tokenContract "0x79BF20B3F3b70A68E2aAE59603467fE0A6F242Ee"
```
- add minter
```
bridge-cli erc20 add-minter \
--erc20Address "0x79BF20B3F3b70A68E2aAE59603467fE0A6F242Ee" \
--minter "0x8638217adE469A835A18C73144252193d91FEba4"
```
- check balance
```
bridge-cli erc20 balance \
--erc20Address "0x79BF20B3F3b70A68E2aAE59603467fE0A6F242Ee" \
--address "0x8638217adE469A835A18C73144252193d91FEba4"
```
- add approve
```
bridge-cli erc20 approve \
--erc20Address "0x79BF20B3F3b70A68E2aAE59603467fE0A6F242Ee" \
--recipient "0x8638217adE469A835A18C73144252193d91FEba4" \
--amount 1000000000000000000000
```
- transfer from wrap selendra to native selendra
```
bridge-cli erc20 deposit \
--bridge "0x1A27e1a295E40c7737D77A4e1D6A7FD0140Ea766" \
--recipient "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d" \
--amount 30000000000000000000 \
--dest 1 \
--resourceId "0x000000000000000000000079BF20B3F3b70A68E2aAE59603467fE0A6F242Ee2a"
```