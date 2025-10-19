# Contracts (Hardhat v3)

Hardhat v3 setup for ETHGlobal Online 2025.

## Requirements

- Node 22+
- PNPM 10+
- Set environment variables:
  - `SEPOLIA_RPC_URL`
  - `ARBITRUM_SEPOLIA_RPC_URL`
  - `PRIVATE_KEY` (deploy/test account)

## Install

Run from the monorepo root:

```sh
pnpm install
```

Or only this package:

```sh
pnpm --filter contract install
```

## Common commands

From this folder (`pkgs/contract`):

```sh
pnpm build             # compile contracts
pnpm test              # run tests (node:test + viem)
pnpm deploy:Counter    # deploy Counter via Ignition (local or with --network)
pnpm get-balance       # example script fetching chain info and balance
pnpm increment-counter # call inc() on deployed Counter
```

Examples:

```sh
pnpm hardhat node                       # start local node (optional)
pnpm hardhat ignition deploy ignition/modules/Counter.ts
pnpm hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```

## Notes

- Solidity `0.8.28` with a production profile enabling optimizer.
- Test networks configured: `sepolia`, `arbitrumSepolia`.
- Includes an OpenZeppelin-based `ExampleToken.sol` to validate OZ integration.

