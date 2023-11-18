// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';

// eslint-disable-next-line jsdoc/require-jsdoc
export default function getEndpoint(
  _genesisHash: string | undefined,
): string | undefined {
  const allEndpoints = createWsEndpoints(() => '');

  const endpoints = allEndpoints?.filter(
    ({ genesisHash, value }) =>
      String(genesisHash) === _genesisHash && Boolean(value),
  );

  return (
    endpoints[3]?.value ||
    endpoints[2]?.value ||
    endpoints[1]?.value ||
    endpoints[0]?.value
  );
}
