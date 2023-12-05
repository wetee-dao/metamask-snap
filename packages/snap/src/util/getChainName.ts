// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getChain } from '../chains';

export const sanitizeChainName = (chainName: string | undefined) =>
  chainName
    ?.replace(' Relay Chain', '')
    ?.replace(' Network', '')
    ?.replace(' chain', '')
    ?.replace(' Chain', '')
    ?.replace(' Finance', '')
    ?.replace(/\s/g, '');

// eslint-disable-next-line jsdoc/require-jsdoc
export default function getChainName(
  _genesisHash: string | undefined,
): string | undefined {
  if (!_genesisHash) {
    console.info('_genesisHash should not be undefined');
    return undefined;
  }
  const chainName =
    getChain(_genesisHash)?.displayName || getChain(_genesisHash)?.network;

  console.info('chainName is:', chainName);

  return sanitizeChainName(chainName)?.toLowerCase();
}
