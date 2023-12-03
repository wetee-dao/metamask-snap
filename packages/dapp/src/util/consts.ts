const LOCAL_SNAP_ID = 'local:http://localhost:8080';
// const NPM_SNAP_ID = 'npm:@polkagate/snap';

// export const POLKAMASK_SNAP_IDS = [LOCAL_SNAP_ID, NPM_SNAP_ID]

export const DEFAULT_SNAP_ORIGIN =
  // process.env.SNAP_ORIGIN ?? `npm:@polkagate/snap`;
  process.env.SNAP_ORIGIN ?? LOCAL_SNAP_ID;

export const SUPPORTED_SNAPS = {
  [DEFAULT_SNAP_ORIGIN]: { version: '>=0.1.4' },
  // 'npm:@chainsafe/polkadot-snap': {},
};

export const POLKAMASK_ACCOUNT_META_SOURCE = 'polkamask'