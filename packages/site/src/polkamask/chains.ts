import { selectableNetworks } from '@polkadot/networks';

export type MetadataDefBase = {
  chain: string;
  genesisHash: string;
  icon: string;
  ss58Format: number;
  chainType?: 'substrate' | 'ethereum';
};

const chains: MetadataDefBase[] = selectableNetworks
  .filter(({ genesisHash }) => Boolean(genesisHash.length))
  .map((network) => ({
    chain: network.displayName,
    genesisHash: network.genesisHash[0],
    icon: network.icon,
    ss58Format: network.prefix,
  }));

export default chains;
