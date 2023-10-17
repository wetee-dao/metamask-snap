import { JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { getChain } from '../chains';
import { DEFAULT_CHAIN_NAME, DEFAULT_COIN_TYPE } from '../defaults';

export const getKeyPair = async (
  chainName: string = DEFAULT_CHAIN_NAME,
  genesisHash?: string,
): Promise<KeyringPair> => {
  console.log('getKeyPair:', chainName, genesisHash);
  const { prefix } = getChain((genesisHash || chainName) as string);
  const BIP44CoinNode = (await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: DEFAULT_COIN_TYPE,
    },
  })) as JsonBIP44CoinTypeNode;

  const seed = BIP44CoinNode?.privateKey?.slice(0, 32);
  const keyring = new Keyring({ ss58Format: prefix });
  const keyPair = keyring.addFromSeed(stringToU8a(seed));

  return keyPair;
};
