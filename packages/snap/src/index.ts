import {
  divider,
  OnRpcRequestHandler,
  heading,
  panel,
  text,
} from '@metamask/snaps-sdk';
import type { OnHomePageHandler, OnInstallHandler } from '@metamask/snaps-sdk';
import { getAddress, signJSON, signRaw } from './rpc';
import { getMetadataList, setMetadata } from './rpc/metadata';
import { getKeyPair } from './util/getKeyPair';
import { DEFAULT_CHAIN_NAME } from './defaults';
import { accountDemo } from './ui/accountDemo';
import { getDefaultTokenBalances } from './util/getDefaultTokenBalances';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log('Received request in snap:', request);
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

/**
 * Handle incoming home page requests from the MetaMask clients.
 *
 * @returns A static panel rendered with custom UI.
 */
export const onHomePage: OnHomePageHandler = async () => {
  const { address } = await getKeyPair(DEFAULT_CHAIN_NAME);
  const balances = await getDefaultTokenBalances(address);

  return {
    content: accountDemo(address, balances),
  };
};

/**
 * Handle installation of the snap. This handler is called when the snap is
 * installed.
 */
export const onInstall: OnInstallHandler = async () => {
  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        heading('Your account is now created 🚀'),
        divider(),
        text('Ready for use on various Substrate-based chains.'),
        text(
          'To manage your account, please visit: **https://apps.polkagate.xyz**',
        ),
      ]),
    },
  });
};
