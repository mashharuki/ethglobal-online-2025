import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import hardhatViem from "@nomicfoundation/hardhat-viem";
import { configVariable } from "hardhat/config";
import type { HardhatPlugin } from "hardhat/types/plugins";

const taskPlugin: HardhatPlugin = {
  id: "hardhat-task-plugin",
  tasks: [],
};

const config: HardhatUserConfig = {
  plugins: [hardhatViem, hardhatToolboxViemPlugin, hardhatVerify, taskPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("PRIVATE_KEY")],
    },
    arbitrumSepolia: {
      type: "http",
      url: configVariable("ARBITRUM_SEPOLIA_RPC_URL"),
      accounts: [configVariable("PRIVATE_KEY")],
    },
  },
  paths: {
    tests: {
      solidity: "./contracts/test",
    },
  },
  verify: {
    blockscout: {
      enabled: true,
    },
  },
};

export default config;
