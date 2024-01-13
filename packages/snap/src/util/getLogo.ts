// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';
import getChainName from './getChainName';

const endpoints = createWsEndpoints(() => '');

/**
 * Find a chain logo related to its genesisHAsh.
 *
 * @param _genesisHash - A genesisHash of a chain.
 * @returns The logo in base64 format.
 */
export default function getLogo(_genesisHash: string): string {
  const chainName = getChainName(_genesisHash);

  const endpoint = endpoints.find((o) => o.info?.toLowerCase() === chainName);

  return endpoint?.ui?.logo as string;
}
