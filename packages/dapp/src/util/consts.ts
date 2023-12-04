import { getLatestPackageVersion } from "./getLatestPackageVersion";

let SNAP_VERSION = '>=0.1.5';

// Example usage
const packageName = '@polkagate/snap';
getLatestPackageVersion(packageName)
  .then((latestVersion) => {
    SNAP_VERSION = latestVersion;
    console.log(`Latest version of ${packageName}: ${latestVersion}`);
  })
  .catch((error) => {
    console.error('Failed to get the latest version:', error);
  });

// const LOCAL_SNAP_ID = 'local:http://localhost:8080';
const NPM_SNAP_ID = 'npm:@polkagate/snap';

// export const POLKAMASK_SNAP_IDS = [LOCAL_SNAP_ID, NPM_SNAP_ID]

export const DEFAULT_SNAP_ORIGIN =
  process.env.SNAP_ORIGIN ?? NPM_SNAP_ID;
// process.env.SNAP_ORIGIN ?? LOCAL_SNAP_ID;

export const SUPPORTED_SNAPS = {
  [DEFAULT_SNAP_ORIGIN]: { version: SNAP_VERSION },
  // 'npm:@chainsafe/polkadot-snap': {},
};

export const POLKAMASK_ACCOUNT_META_SOURCE = 'polkamask'