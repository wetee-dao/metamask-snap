// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable jsdoc/require-jsdoc */

import { createWsEndpoints } from '@polkadot/apps-config';

const endpoints = createWsEndpoints(() => '');

export default function getLogo(_genesisHash: string): string {
  const endpoint = endpoints.find(
    ({ genesisHash }) => _genesisHash === genesisHash,
  );

  return endpoint?.ui?.logo as string;
}
