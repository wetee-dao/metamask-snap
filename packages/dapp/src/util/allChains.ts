import { selectableNetworks } from '@polkadot/networks';
import { Network } from '@polkadot/networks/types';

const westend = {
  decimals: [12],
  displayName: 'westend',
  genesisHash: [
    '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
  ],
  hasLedgerSupport: false,
  icon: 'polkadot',
  isIgnored: false,
  isTestnet: true,
  network: 'westend',
  prefix: 42,
  slip44: 354,
  standardAccount: '*25519',
  symbols: ['WND'],
  website: 'https://polkadot.network',
};


export const allChains = (): { genesisHash: string, displayName: string }[] => {
  if (!selectableNetworks.includes(westend as Network)) {
    selectableNetworks.push(westend as Network);
  }

  const chainsWithGenesisHash = selectableNetworks.filter(({ displayName, genesisHash, slip44 }) => genesisHash.length && slip44 && displayName!=='xx network');

  return chainsWithGenesisHash.map(({ genesisHash, displayName }) => {
      return { genesisHash: genesisHash[0], displayName }
  });
};
