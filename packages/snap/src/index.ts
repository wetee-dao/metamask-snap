import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { createAddress } from './rpc/createAddress';
import { signRaw } from './rpc';
import { signJSON } from './rpc/signJSON';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  let address;
  await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState: { hello: 'world' } },
  });

  // At a later time, get the data stored.
  const persistedData = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });

  console.log('request.params:',request.params)
  switch (request.method) {
    case 'signJSON':
      return await signJSON(request.params.payload);
    case 'signRaw':
      return await signRaw(request.params.raw);
    case 'getAddress':
      return await createAddress(request.params.chainName);
    default:
      throw new Error('Method not found.');
  }
};
