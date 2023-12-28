const SNAP_VERSION = '>=0.1.11';
const LOCAL_SNAP_ID = 'local:http://localhost:8080';
const NPM_SNAP_ID = 'npm:@polkagate/snap';

export const DEFAULT_SNAP_ORIGIN =  process.env.REACT_APP_MODE === 'production' ? NPM_SNAP_ID : LOCAL_SNAP_ID;

export const SUPPORTED_SNAPS = {
  [DEFAULT_SNAP_ORIGIN]: { version: SNAP_VERSION },
  // 'npm:@chainsafe/polkadot-snap': {},
};

export const POLKAMASK_ACCOUNT_META_SOURCE = 'polkamask';