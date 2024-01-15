// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';

const endpoints = createWsEndpoints(() => '');

export const sanitizeChainName = (chainName: string | undefined) => (chainName?.replace(' Relay Chain', '')?.replace(' Network', '')?.replace(' chain', '')?.replace(' Chain', '')?.replace(' Finance', '')?.replace(' Mainnet', '')?.replace(/\s/g, ''));

export default function getLogo(info: string): string {
  const iconName = sanitizeChainName(info)?.toLowerCase();

  const endpoint = endpoints.find((o) => {
    return o.info?.toLowerCase() === iconName || o.text === info
  });

  return endpoint?.ui?.logo as string;
}
