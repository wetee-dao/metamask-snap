import { OnRpcRequestHandler } from '@metamask/snaps-types';

import { createAddress } from './rpc/createAddress';
import { signRaw } from './rpc';
import { signJSON } from './rpc/signJSON';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  const _params = request.params;
  switch (request.method) {
    case 'signJSON':
      return _params?.payload && (await signJSON(_params?.payload));
    case 'signRaw':
      return _params?.raw && (await signRaw(request.params.raw));
    case 'getAddress':
      return await createAddress(_params.chainName);

    default:
      throw new Error('Method not found.');
  }
};
