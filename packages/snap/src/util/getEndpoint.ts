// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';

// eslint-disable-next-line jsdoc/require-jsdoc
export default function getEndpoint(
  _genesisHash: string | undefined,
): string | undefined {
  const allEndpoints = createWsEndpoints(() => '');

  console.log('allEndpoints[0]', allEndpoints[0])
  const endpoints = allEndpoints?.filter(
    ({ genesisHash }) => genesisHash === _genesisHash,
  );

  return endpoints?.[3]?.value || endpoints[0].value;
}
