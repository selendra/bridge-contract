import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ownerAccount =
  process.env.PRIVATE_KEY ||
  "0xf349f52f154f7d3be7543ff30751e6eb6bd83622e8b23525d27cf3919b5cbfc0";

const config: HardhatUserConfig = {
  paths: {
    artifacts: "artifacts",
    cache: "cache",
    sources: "contracts",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.11",
        settings: {
          optimizer: { enabled: true, runs: 10000 }
        },
      },
    ],
  },
  defaultNetwork: "selendraTestnet",
  networks: {
    localhost: {
      url: "http://localhost:8545",
      accounts: [ownerAccount],
    },
    selendra: {
      url: "https://rpc.selendra.org",
      chainId: 1961,
      accounts: [ownerAccount],
    },
    selendraTestnet: {
      url: "https://rpc-testnet.selendra.org",
      chainId: 1953,
      accounts: [ownerAccount],
    },
  },
};

export default config;
