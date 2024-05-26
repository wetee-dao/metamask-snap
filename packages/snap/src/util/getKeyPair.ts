import { JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { DEFAULT_COIN_TYPE } from '../defaults';

export const getKeyPair = async (
  chain: number
): Promise<KeyringPair> => {

  const BIP44CoinNode = (await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: DEFAULT_COIN_TYPE,
    },
  })) as JsonBIP44CoinTypeNode;

  const seed = BIP44CoinNode?.privateKey?.slice(0, 32);
  const keyring = new Keyring({ ss58Format: chain });
  const keyPair = keyring.addFromSeed(stringToU8a(seed));

  return keyPair;
};
