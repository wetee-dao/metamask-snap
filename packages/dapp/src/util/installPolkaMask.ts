import { SUPPORTED_SNAPS } from "./consts";

type SnapConfiguration = {
  version: string;
  id: string;
  initialPermissions: any;
  enabled: boolean;
  blocked: boolean;
};

export type SnapsConfigurations = {
  [snapKey: string]: SnapConfiguration;
};

export const installPolkaMask = async (): Promise<SnapsConfigurations | undefined> => {
  try {
    const result = await window.ethereum.request({
      method: 'wallet_requestSnaps',
      params: {
        ...SUPPORTED_SNAPS,
      },
    });

    console.log('connectSnap:', result);

    return result;
  } catch (e) {
    console.log('user rejects installation:', e);
  }
};