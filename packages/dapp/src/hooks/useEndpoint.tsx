// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { createWsEndpoints } from '@polkadot/apps-config';
import useTranslation from './useTranslation';

export default function useEndpoint(chainName: string | undefined): string | undefined {
    const { t } = useTranslation();
    const [endpoint, setEndpoint] = useState<string | undefined>();

    useEffect(() => {
        if (!chainName) {
            setEndpoint(undefined);

            return;
        }

        const allEndpoints = createWsEndpoints(t);

        const endpoints = allEndpoints?.filter((e) =>
            e.value &&
            (String(e.info)?.toLowerCase() === chainName?.toLowerCase() ||
                String(e.text)?.toLowerCase()?.includes(chainName?.toLowerCase()))
        );

        if (endpoints?.length) {
            setEndpoint(endpoints[2]?.value || endpoints[1]?.value || endpoints[0].value);
        } else {
            // Endpoint not found, handle the error (e.g., set a default value?)
            setEndpoint(undefined);
        }
    }, [chainName, t]);

    return endpoint;
}
