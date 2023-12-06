import { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { getAddress, signJSON, signRaw } from './rpc';
import { getMetadataList, setMetadata } from './rpc/metadata';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log('received request in snap:', request);
  const _params = request.params;

  switch (request.method) {
    case 'signJSON':
      return _params?.payload && (await signJSON(origin, _params.payload));
    case 'signRaw':
      return _params?.raw && (await signRaw(origin, _params.raw));
    case 'getAddress':
      return await getAddress(_params?.chainName);

    /** To manage snap state */
    case 'setMetadata':
      return (
        _params?.metaData && (await setMetadata(origin, _params?.metaData))
      );
    case 'getMetadataList':
      return await getMetadataList();

    default:
      throw new Error('Method not found in the snap onRpcRequest.');
  }
};
