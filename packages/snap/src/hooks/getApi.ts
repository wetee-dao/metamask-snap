/* eslint-disable jsdoc/require-jsdoc */
import { ApiPromise, HttpProvider } from '@polkadot/api';

import getEndpoint from './getEndpoint';

export async function getApi(genesisHash: string): Promise<ApiPromise> {
  const endpoint = getEndpoint(genesisHash);
  if (!endpoint) {
    throw new Error(`No endpoint with genesisHash: '${genesisHash}'.`);
  }
  const adjustedUrl = endpoint?.replace('wss://', 'https://');
  const httpProvider = new HttpProvider(adjustedUrl);

  const api = await ApiPromise.create({ provider: httpProvider });

  return api;
}
