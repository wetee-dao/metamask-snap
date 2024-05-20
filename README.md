# PolkaGate Snap
![web3 foundation_grants_badge_black](https://github.com/PolkaGate/snap/assets/46442452/f877af2d-7fef-41ce-9ba2-bf59726d3064)

![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
![](https://img.shields.io/github/issues-raw/PolkaGate/snap)
[![ci](https://github.com/PolkaGate/snap/actions/workflows/ci-workflow.yml/badge.svg)](https://github.com/PolkaGate/snap/actions/workflows/ci-workflow.yml)


 A MetaMask snap for seamless interaction with the Polkadot ecosystem, a prominent platform for cross-chain communication and scalability. Now you can use your MetaMask wallet to access Polkadot dApps and tokens effortlessly.

To integrate this snap into your dApp, you can easily upgrade your existing @polkadot/extension-dapp by replacing it with [@polkadot/extension-dapp](https://www.npmjs.com/package/@polkadot/extension-dapp). It's important to note that once our changes are merged into the official extension-dapp, this manual update will no longer be necessary.

⏬ Polkagate snap is now available on MetaMask Snap Directory for download: https://snaps.metamask.io/snap/npm/polkagate/snap/

<p align="center">
  <img src="https://raw.githubusercontent.com/Nick-1979/PolkadotJsPlusPictures/main/polkagate/polkamask%20small.bmp" alt="Image" width="600" />
</p>

## Running the Repository

The repository contains a  dApp located in the `./packages/dapp` directory and the snap code, which can be found in `./packages/snap`. To try out the snap, follow these steps in your terminal:

```bash
git clone https://github.com/PolkaGate/snap.git
cd snap
yarn install
yarn run start
```

After executing these commands, you can access a basic decentralized application (dApp) page for testing the snap at http://localhost:8000/. For more advanced dApp visit [apps.polkagate.xyz](https://apps.polkagate.xyz). Note, MetaMask Flask (MetaMask) needs to be installed to interact with the snap and dApp.

## Test
To execute the unit tests for the snap, use the following command(s):

```
yarn install
yarn build
yarn test
```

## Docker

To build and run docker container(s) run:

```
yarn install
yarn compose
```
Afterward, you can access user interfaces as follows:

- http://localhost:8000: This displays a dapp designed for testing the snap.

- http://localhost:80: This presents a modified version of the Polkadot Cloud in the staking dashboard.



<p align="center">
  <img src="https://raw.githubusercontent.com/PolkaGate/snap/main/docs/images/simpleTransfer.png" alt="Image" width="1000" />
</p>

Note: This MetaMask snap operates autonomously and does not rely on other extensions within the Polkadot ecosystem for its functionality.

## Polkagate Snap Security Audit Report

https://sayfer.io/audits/metamask-snap-audit-report-for-polkagate-snap/

---

For more detailed help, please refer to the [wiki](https://github.com/PolkaGate/snap/wiki).

