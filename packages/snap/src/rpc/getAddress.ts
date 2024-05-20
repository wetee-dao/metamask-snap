import type {
  InjectedMetadataKnown,
} from '@polkadot/extension-inject/types';
import { DEFAULT_CHAIN_NAME } from '../defaults';
import { getKeyPair } from '../util/getKeyPair';
import { getMetadataList, getSavedMeta } from './metadata';


export const getAddress = async (chainHash?: string): Promise<string> => {
  const prefix = chainHash ? (await getSavedMeta(chainHash))?.ss58Format||42 : 42; 
  const account = await getKeyPair(prefix);

  if (!account) {
    throw new Error('account not found');
  }

  const { address } = account;

  return address;
};
