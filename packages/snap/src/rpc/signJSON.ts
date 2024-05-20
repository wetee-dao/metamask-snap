import { SignerPayloadJSON } from '@polkadot/types/types';
import type { SignerResult } from '@polkadot/api/types';
import { getKeyPair } from '../util/getKeyPair';
import { getSavedMeta, showConfirmTx } from '.';
import { metadataExpand } from '@polkadot/extension-chains';

export const signJSON = async (
  origin: string,
  payload: SignerPayloadJSON,
): Promise<SignerResult | undefined> => {
  try {
    const def = await getSavedMeta(payload.genesisHash);
    if (!def) {
      throw new Error('Chain has not set metadata.');
    }

    const chain = metadataExpand(def!, false)
    chain.registry.signedExtensions

    const registry = chain.registry;
    registry.setSignedExtensions(payload.signedExtensions, chain.definition.userExtensions);

    const isConfirmed = await showConfirmTx(chain, origin, payload);

    if (!isConfirmed) {
      throw new Error('User declined the signing request.');
    }

    const keyPair = await getKeyPair(chain.ss58Format);

    const { signature } = registry
      .createType('ExtrinsicPayload', payload, { version: payload.version })
      .sign(keyPair);

    return { id: 1, signature };
  } catch (e) {
    throw e;
  }
};