import { invokeSnap } from './invokeSnap';

export const getMyAddress = async (chainName: string): Promise<string> => {
  return await invokeSnap({ method: 'getAddress', params: { chainName } });
};
