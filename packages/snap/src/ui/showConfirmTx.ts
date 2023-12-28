/* eslint-disable no-case-declarations */
/* eslint-disable jsdoc/require-jsdoc */
import { divider, heading, image, panel, text } from '@metamask/snaps-sdk';
import { ApiPromise } from '@polkadot/api';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { bnToBn } from '@polkadot/util';
import { Balance } from '@polkadot/types/interfaces';
import getLogo from '../util/getLogo';
import getChainName from '../util/getChainName';
import { formatCamelCase } from '../util/formatCamelCase';
import { getIdentity } from '../util/getIdentity';
import { txContent } from './txContent';
import { Decoded, getDecoded } from '../rpc';

const EMPTY_LOGO = `<svg width="100" height="100">
<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>`;

const transactionContent = (
  api: ApiPromise,
  origin: string,
  payload: SignerPayloadJSON,
  partialFee: Balance,
  decoded: Decoded,
  maybeReceiverIdentity: string,
) => {
  const headingText = `Transaction Approval Request from ${origin}`;

  const { args, callIndex } = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(callIndex);

  const action = `${section}_${method}`;
  const chainName = getChainName(payload.genesisHash);

  let chainLogoSvg = EMPTY_LOGO;
  const dataURI = getLogo(payload.genesisHash);
  const maybeSvgString = atob(
    dataURI.replace(/data:image\/svg\+xml;base64,/u, ''),
  );
  const indexOfFirstSvgTag = maybeSvgString.indexOf('<svg');
  if (indexOfFirstSvgTag !== -1) {
    chainLogoSvg = maybeSvgString.substring(indexOfFirstSvgTag);
  }

  const header = [
    heading(headingText),
    divider(),
    text(
      `Action: **${formatCamelCase(section)}** (**${formatCamelCase(
        method,
      )}**)`,
    ),
    divider(),
  ];

  const footer = [
    divider(),
    text(`Estimated Fee: **${partialFee.toHuman()}**`),
    divider(),
    text(`Chain Name: **${formatCamelCase(chainName)}**`),
    // divider(),
    // panel([text('Chain Logo:'), image(chainLogoSvg)]), // uncomment when image size adjustment will be enable by Metamask
    divider(),
    text(`More info: **${decoded.docs || 'Update metadata to view this!'}**`),
  ];

  return panel([
    ...header,
    ...txContent(api, args, action, decoded, maybeReceiverIdentity),
    ...footer,
  ]);
};

export async function showConfirmTx(
  api: ApiPromise,
  origin: string,
  payload: SignerPayloadJSON,
): Promise<string | boolean | null> {
  const { args, callIndex } = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(callIndex);

  const { partialFee } = await api.tx[section][method](...args).paymentInfo(
    payload.address,
  );

  const { genesisHash, specVersion } = payload;
  const decoded = await getDecoded(
    genesisHash,
    payload.method,
    bnToBn(specVersion),
  );

  let maybeReceiverIdentity = 'Unknown';
  if (['transfer', 'transferKeepAlive', 'transferAll'].includes(method)) {
    maybeReceiverIdentity = await getIdentity(api, String(args[0]));
  }

  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: transactionContent(
        api,
        origin,
        payload,
        partialFee,
        decoded,
        maybeReceiverIdentity,
      ),
      type: 'confirmation',
    },
  });

  return userResponse;
}
