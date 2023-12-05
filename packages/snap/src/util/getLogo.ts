// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';
import getChainName from './getChainName';

const endpoints = createWsEndpoints(() => '');

/**
 * @param _genesisHash
 * @description get logo of a chain based on its genesisHash
 */
export default function getLogo(_genesisHash: string): string {
  const chainName = getChainName(_genesisHash);

  const endpoint = endpoints.find((o) => o.info?.toLowerCase() === chainName);

  return endpoint?.ui?.logo as string;
}
