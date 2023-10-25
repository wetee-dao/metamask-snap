import { SignerPayloadJSON } from '@polkadot/types/types';
import type { SignerResult } from '@polkadot/api/types';
import { getApi } from '../util/getApi';
import { getKeyPair } from '../util/getKeyPair';
import { showConfirmTx } from '.';

export const signJSON = async (
  payload: SignerPayloadJSON,
): Promise<SignerResult | undefined> => {
  try {
    const api = await getApi(payload.genesisHash);

    const isConfirmed = await showConfirmTx(api, payload);

    if (!isConfirmed) {
      throw new Error('User declined the signing request.');
    }
    const keyPair = await getKeyPair(payload.genesisHash);

    const extrinsic = api.registry.createType('ExtrinsicPayload', payload, {
      version: payload.version,
    });

    // TODO: Explore signing options without relying on the API and discover methods for obtaining chain metadata offline!

    const { signature } = extrinsic.sign(keyPair);

    return { id: 1, signature };
  } catch (e) {
    console.info('Error while signing JSON:', e);
    return undefined;
  }
};
