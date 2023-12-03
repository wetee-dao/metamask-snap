import { getChain } from './getChain';

export const getGenesisHash = (chainName: string): string => {
  return getChain(chainName)?.genesisHash?.[0];
};
