// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';

const endpoints = createWsEndpoints((k, v) => v?.toString() || k);

/**
 *
 */
export function getApiEndpoint(apiUrl?: string): LinkOption | null {
  return endpoints.find(({ value }) => value === apiUrl) || null;
}