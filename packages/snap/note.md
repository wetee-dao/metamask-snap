 "@polkadot/react-api" uses "@polkadot/extension-dapp", which has web3Enable that being used as
           const injectedPromise = web3Enable('polkadot-js/apps');
in react-api


hence "bundle.ts" in @polkadot/extension-dapp needs to be updated!