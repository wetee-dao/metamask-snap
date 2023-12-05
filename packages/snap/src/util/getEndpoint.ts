// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';
import getChainName from './getChainName';

// eslint-disable-next-line jsdoc/require-jsdoc
export default function getEndpoint(
  _genesisHash: string | undefined,
): string | undefined {
  if (!_genesisHash) {
    console.info('_genesisHash should not be undefined');
    return undefined;
  }
  const allEndpoints = createWsEndpoints(() => '');
  const chainName = getChainName(_genesisHash);

  const endpoints = allEndpoints?.filter(
    (e) =>
      e.value &&
      (String(e.info)?.toLowerCase() === chainName ||
        String(e.text)
          ?.toLowerCase()
          ?.includes(chainName || '')),
  );

  return (
    endpoints[3]?.value ||
    endpoints[2]?.value ||
    endpoints[1]?.value ||
    endpoints[0]?.value
  );
}
