import { defaultSnapOrigin } from '../../config';

type SnapRpcRequestParams = {
  snapId?: string;
  method: string;
  params?: Record<string, any>;
};

export const invokeSnap = async (args: SnapRpcRequestParams) => {
  const result = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: args?.snapId || defaultSnapOrigin,
      request: {
        method: args.method,
        params: args?.params,
      },
    },
  });

  return result as unknown as any;
};
