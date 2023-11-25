import { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { getAddress, signJSON, signRaw } from './rpc';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log('request:', request);
  const _params = request.params;

  switch (request.method) {
    case 'signJSON':
      return _params?.payload && (await signJSON(origin, _params.payload));
    case 'signRaw':
      return _params?.raw && (await signRaw(origin, _params.raw));
    case 'getAddress':
      return await getAddress(_params?.chainName);

    default:
      throw new Error('Method not found in the snap onRpcRequest.');
  }
};
