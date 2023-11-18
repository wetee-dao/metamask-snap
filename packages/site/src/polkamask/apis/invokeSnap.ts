import { DEFAULT_SNAP_ORIGIN } from '../../config';

type SnapRpcRequestParams = {
  snapId?: string;
  method: string;
  params?: Record<string, any>;
};

export const invokeSnap = async (args: SnapRpcRequestParams) => {
  console.log('invoking snap with:', args)
  const result = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: args?.snapId || DEFAULT_SNAP_ORIGIN,
      request: {
        method: args.method,
        params: args?.params,
      },
    },
  });

  return result as unknown as any;
};
