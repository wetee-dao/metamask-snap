import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { createAddress, signJSON, signRaw } from './rpc';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log('request:', request);
  const _params = request.params;


  switch (request.method) {
    case 'signJSON':
      return _params?.payload && (await signJSON(_params.payload));
    case 'signRaw':
      return _params?.raw && (await signRaw(_params.raw));
    case 'getAddress':
      return await createAddress(_params?.chainName);

    default:
      throw new Error('Method not found in the snap onRpcRequest.');
  }
};
