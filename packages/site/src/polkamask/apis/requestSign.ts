import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import type { SignerResult } from '@polkadot/api/types';
import { invokeSnap } from './invokeSnap';

type SignType = 'raw' | 'JSON';

export const requestSign = async (
  data: any,
  type: SignType = 'JSON',
): Promise<string> => {
  return await invokeSnap({
    method: type === 'JSON' ? 'signJSONData' : 'signRawData',
    params: { data },
  });
};

export const requestSignJSON = async (
  payload: SignerPayloadJSON,
): Promise<SignerResult> => {
  return await invokeSnap({
    method: 'signJSON',
    params: { payload },
  });
};

export const requestSignRaw = async (
  // signs a raw payload, only the bytes data as supplied
  raw: SignerPayloadRaw,
): Promise<SignerResult> => {
  return await invokeSnap({
    method: 'signRaw',
    params: { raw },
  });
};
