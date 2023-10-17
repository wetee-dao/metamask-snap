import { SignerPayloadJSON } from '@polkadot/types/types';
import { TypeRegistry } from '@polkadot/types';
import type { SignerResult } from '@polkadot/api/types';
import { showConfirm } from './showConfirm';
import { getApi } from '../hooks/getApi';
import { getKeyPair } from '../util/getKeyPair';

const registry = new TypeRegistry();

export const signJSON = async (
  payload: SignerPayloadJSON,
): Promise<SignerResult> => {
  const api = await getApi(payload.genesisHash);

  const isConfirmed = await showConfirm(api, payload);

  if (!isConfirmed) {
    throw new Error('User rejected the signing!');
  }
  const keyPair = await getKeyPair(payload.genesisHash);

  const extrinsic = api.registry.createType('ExtrinsicPayload', payload, {
    version: payload.version,
  });

  // registry.setSignedExtensions(payload.signedExtensions, undefined); //currentMetadata?.userExtensions
  // eslint-disable-next-line no-eval
  // const _sign = eval(`(${sign})`);
  // const dynamicSignFunction = new Function(sign);
  // const newsign = dynamicSignFunction.bind(this);
  // const result = _sign(registry, keyPair);

  const { signature } = extrinsic.sign(keyPair);

  return { id: 1, signature };
};
